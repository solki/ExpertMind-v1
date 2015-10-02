from ExpertMind.tag import Tag
from ExpertMind.nodes import Nodes

__author__ = 'hansmong'


def check_add_child_node(data):
    # check nodeDisplay
    if 'nodeDisplay' not in data:
        raise ValueError("No nodeDisplay in given node.")

    # check nodeDescription
    if 'nodeDescription' not in data:
        raise ValueError("No nodeDescription in given node.")

    # check nodeTags
    if 'nodeTags' not in data:
        data["nodeTags"] = {}
    else:
        for node_tag in data["nodeTags"]:
            if '_id' not in node_tag:
                raise ValueError("Malformed node tag array: lack of tag id \"_id\"")
            else:
                if Tag.retrieveById(node_tag["_id"]) is None:  # non-existent node tag in database
                    raise ValueError("Node tag does not exist in database: tag _id=%s" % node_tag["_id"])

    # check nodeParents
    if 'nodeParents' not in data or len(data["nodeParents"]) == 0:
        raise ValueError("No nodeParents in given node.")
    else:
        parent = data["nodeParents"][0]
        if '_id' not in parent:
            raise ValueError("Malformed node parent array: lack of parent node id \"_id\"")
        else:
            if Nodes.retrieveById(parent["_id"]) is None:  # non-existent parent node in database
                raise ValueError(
                    "Parent node information does not exist in database: parent _id=%s" % parent["_id"])
# check add child node data end

