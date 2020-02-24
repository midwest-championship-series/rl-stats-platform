import json
from src.process_game import analyzeGame
# import numpy as np

def handler(event, context):
    # a = np.arange(15).reshape(3, 5)

    # print("Your numpy array:")
    # print(a)

    response = {
        "statusCode": 200,
        "body": json.dumps(analyzeGame())
        # "body": json.dumps(a)
    }

    return response
