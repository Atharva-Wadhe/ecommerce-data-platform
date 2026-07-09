from pathlib import Path
import sys
sys.path.insert(0, str(Path('GoldLayer').resolve()))

from pyspark.sql import SparkSession
from facts.orders_fact import OrdersFact
from warehouse.dimension_lookup_service import DimensionLookupService

spark = SparkSession.builder.master('local[*]').appName('debug_factbuilder').getOrCreate()
processing_date = '2017-10-01'

silver_path = Path('data/silver')

dfs = {
    'orders': spark.read.parquet(str(silver_path / 'orders' / f'processing_date={processing_date}')),
    'order_items': spark.read.parquet(str(silver_path / 'order_items' / f'processing_date={processing_date}')),
    'payments': spark.read.parquet(str(silver_path / 'payments' / f'processing_date={processing_date}')),
    'reviews': spark.read.parquet(str(silver_path / 'reviews' / f'processing_date={processing_date}')),
}

fact = OrdersFact().build(dfs)
print('FACT COLUMNS BEFORE LOOKUP', fact.columns)

lookup_service = DimensionLookupService(spark=spark, gold_path='data/gold')
left = fact.withColumn('order_purchase_date', fact['order_purchase_timestamp'].cast('date'))
print('COLUMNS AFTER ADDING DATE', left.columns)

left = left.join(
    lookup_service._load_dimension('customers').select('customer_id', 'customer_id_key'),
    on='customer_id', how='left'
)
print('COLUMNS AFTER CUSTOMER JOIN', left.columns)

left = left.join(
    lookup_service._load_dimension('sellers').select('seller_id', 'seller_id_key'),
    on='seller_id', how='left'
)
print('COLUMNS AFTER SELLER JOIN', left.columns)

spark.stop()
