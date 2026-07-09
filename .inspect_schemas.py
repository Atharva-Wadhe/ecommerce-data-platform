from pathlib import Path
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName('inspect').master('local[*]').getOrCreate()
for name in ['orders', 'order_items', 'payments', 'reviews', 'customers', 'sellers', 'products']:
    path = Path('data/silver') / name
    try:
        df = spark.read.parquet(str(path))
        print('TABLE', name)
        print('columns:', df.columns)
        print('schema:', df.schema.simpleString())
        print('-' * 40)
    except Exception as e:
        print('ERROR reading', name, e)
        import traceback
        traceback.print_exc()

spark.stop()
