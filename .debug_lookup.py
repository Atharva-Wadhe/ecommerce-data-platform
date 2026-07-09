from pathlib import Path
import sys
sys.path.insert(0, str(Path('GoldLayer').resolve()))
from pyspark.sql import SparkSession
from facts.orders_fact import OrdersFact
from warehouse.dimension_lookup_service import DimensionLookupService

spark = SparkSession.builder.master('local[*]').appName('debug_lookup').getOrCreate()
processing_date = '2017-10-01'

silver_path = Path('data/silver')
dfs = {
    'orders': spark.read.parquet(str(silver_path / 'orders' / f'processing_date={processing_date}')),
    'order_items': spark.read.parquet(str(silver_path / 'order_items' / f'processing_date={processing_date}')),
    'payments': spark.read.parquet(str(silver_path / 'payments' / f'processing_date={processing_date}')),
    'reviews': spark.read.parquet(str(silver_path / 'reviews' / f'processing_date={processing_date}')),
}

fact = OrdersFact().build(dfs)
print('FACT INITIAL COLUMNS', fact.columns)
lookup_service = DimensionLookupService(spark=spark, gold_path='data/gold')

customers = lookup_service._load_dimension('customers').select('customer_id','customer_id_key')
sellers = lookup_service._load_dimension('sellers').select('seller_id','seller_id_key')
products = lookup_service._load_dimension('products').select('product_id','product_id_key')
dates = lookup_service._load_dimension('dates').select('date','date_key')

fact = fact.withColumn('order_purchase_date', fact['order_purchase_timestamp'].cast('date'))
print('AFTER PURCHASE DATE COLUMNS', fact.columns)

fact = fact.join(customers, on='customer_id', how='left')
print('AFTER CUSTOMERS COLUMNS', fact.columns)

fact = fact.join(sellers, on='seller_id', how='left')
print('AFTER SELLERS COLUMNS', fact.columns)

fact = fact.join(products, on='product_id', how='left')
print('AFTER PRODUCTS COLUMNS', fact.columns)

fact = fact.join(dates, fact['order_purchase_date'] == dates['date'], how='left')
print('AFTER DATES COLUMNS', fact.columns)

spark.stop()
