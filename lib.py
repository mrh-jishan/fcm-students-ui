def getTopNodeCol(df):
    topNode = []
    for col in df:
        topNode.append(col)
    return topNode;


def getNodeDataArray(df):
    node = []
    pos = 140
    for index, row in df.iloc[:, 0:].iterrows():
        node.append({'id': index, 'text': row[0]})
        pos = pos + 100
    return node


def getLinkDataArray(df):
    node_distance = []
    for index, row in df.iloc[:, 0:].iterrows():
        count = 0
        for x in range(row.count() - 1):
            node_distance.append(
                {'from': index, 'to': count, 'text': row[getTopNodeCol(df)[count + 1]], "curviness": 40})
            count = count + 1
    return node_distance