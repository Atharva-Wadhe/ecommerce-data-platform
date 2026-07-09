from pathlib import Path
from pyspark.sql import SparkSession

spark = SparkSession.builder.master('local[*]').appName('debug_schema').getOrCreate()
paths = [
    'data/silver/orders/processing_date=2017-10-01',
    'data/silver/order_items/processing_date=2017-10-01',
    'data/silver/payments/processing_date=2017-10-01',
    'data/silver/reviews/processing_date=2017-10-01',
]
for p in paths:
    path = Path(p)
    print('PATH', path)
    try:
        df = spark.read.parquet(str(path))
        print('COLUMNS', df.columns)
        print('SCHEMA', df.schema.simpleString())
        print('COUNT', df.count())
        print('-'*80)
    except Exception as e:
        print('ERROR', e)
        import traceback
        traceback.print_exc()

spark.stop()
