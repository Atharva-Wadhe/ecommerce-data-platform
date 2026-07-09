from pathlib import Path
from pyspark.sql import SparkSession
from GoldLayer.warehouse.fact_builder import FactBuilder
from GoldLayer.facts.orders_fact import OrdersFact

spark = SparkSession.builder.master('local[*]').appName('debug_fact').getOrCreate()
config_path = Path('GoldLayer/config/config.yaml')

silver_path = Path('data/silver')

processing_date = '2017-10-01'

dfs = {
    'orders': spark.read.parquet(str(silver_path / 'orders' / f'processing_date={processing_date}')),
    'order_items': spark.read.parquet(str(silver_path / 'order_items' / f'processing_date={processing_date}')),
    'payments': spark.read.parquet(str(silver_path / 'payments' / f'processing_date={processing_date}')),
    'reviews': spark.read.parquet(str(silver_path / 'reviews' / f'processing_date={processing_date}')),
}

fact = OrdersFact().build(dfs)
print('FACT COLUMNS', fact.columns)
print('FACT SCHEMA', fact.schema.simpleString())
print('FACT COUNT', fact.count())
fact.show(10, truncate=False)

spark.stop()
