// Generated by CoffeeScript 1.10.0
(function() {
  var init, render;

  init = function() {
    var stage;
    stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
    });
    $.get('user-info-sample.json', function(userData) {
      return $.get('map-sample.json', function(mapData) {
        return render(stage, userData, mapData);
      });
    });
    return $(window).on('resize orientationchange', function() {
      stage.setWidth(window.innerWidth);
      return stage.setHeight(window.innerHeight);
    });
  };

  render = function(stage, userData, mapData) {
    var INFO_TEXT_SIZE, NODE_WIDTH, TITLE_TEXT_SIZE, active_node, buildNode, getNode, hideNodeTree, i, layer, layout, layoutLevel, len, map_nodes, node, nodeGroup, nodeId, ref, toggleNode;
    NODE_WIDTH = 200;
    TITLE_TEXT_SIZE = 18;
    INFO_TEXT_SIZE = 12;
    layer = new Konva.Layer();
    map_nodes = {};
    active_node = null;
    getNode = function(id) {
      return layer.findOne('#node-' + id);
    };
    hideNodeTree = function(rootNode) {
      var bg, i, j, len, len1, ref, subNodeId, subNodes;
      subNodes = map_nodes[rootNode.getId()].sub_nodes;
      for (i = 0, len = subNodes.length; i < len; i++) {
        subNodeId = subNodes[i];
        hideNodeTree(getNode(subNodeId));
      }
      if (subNodes.length > 0) {
        ref = rootNode.find('.node-collapsed-bg');
        for (j = 0, len1 = ref.length; j < len1; j++) {
          bg = ref[j];
          bg.show();
        }
      }
      return rootNode.hide();
    };
    toggleNode = function(node) {
      var bg, collapsed, i, j, len, len1, nodeObj, ref, ref1, results, subNode, subNodeId;
      nodeObj = map_nodes[node.getId()];
      collapsed = false;
      ref = nodeObj.sub_nodes;
      for (i = 0, len = ref.length; i < len; i++) {
        subNodeId = ref[i];
        subNode = getNode(subNodeId);
        if (!subNode.isVisible()) {
          subNode.show();
        } else {
          collapsed = true;
          hideNodeTree(subNode);
        }
      }
      if (nodeObj.sub_nodes.length > 0) {
        ref1 = node.find('.node-collapsed-bg');
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          bg = ref1[j];
          if (collapsed) {
            results.push(bg.show());
          } else {
            results.push(bg.hide());
          }
        }
        return results;
      }
    };
    buildNode = function(node) {
      var infoBarHeight, nodeAuthorText, nodeDownVoteBtn, nodeGroup, nodeInfoBar, nodeInfoBarRect, nodeRect, nodeRect2, nodeRect3, nodeText, nodeUpVoteBtn, nodeVoteBtnGroup, voteBtnGroupWidth;
      nodeText = new Konva.Text({
        text: node.text,
        fontSize: TITLE_TEXT_SIZE,
        fontFamily: 'Calibri',
        fill: '#555',
        width: NODE_WIDTH,
        padding: 20,
        align: 'center'
      });
      nodeUpVoteBtn = new Konva.Text({
        text: "\u21e7" + node.up_vote,
        fontSize: INFO_TEXT_SIZE,
        fontFamily: 'Calibri',
        fill: '#555',
        padding: 9
      });
      nodeDownVoteBtn = new Konva.Text({
        text: "\u21e9" + node.down_vote,
        fontSize: INFO_TEXT_SIZE,
        fontFamily: 'Calibri',
        fill: '#555',
        padding: 9,
        x: nodeUpVoteBtn.getWidth()
      });
      nodeAuthorText = new Konva.Text({
        text: "by " + node.author.name,
        fontSize: INFO_TEXT_SIZE,
        fontFamily: 'Calibri',
        fill: '#555',
        width: NODE_WIDTH,
        padding: 9,
        align: 'left'
      });
      voteBtnGroupWidth = nodeUpVoteBtn.getWidth() + nodeDownVoteBtn.getWidth();
      nodeVoteBtnGroup = new Konva.Group({
        height: Math.max(nodeUpVoteBtn.getHeight(), nodeDownVoteBtn.getHeight()),
        width: voteBtnGroupWidth,
        x: NODE_WIDTH - voteBtnGroupWidth
      });
      nodeVoteBtnGroup.add(nodeUpVoteBtn);
      nodeVoteBtnGroup.add(nodeDownVoteBtn);
      infoBarHeight = Math.max(nodeVoteBtnGroup.getHeight(), nodeAuthorText.getHeight());
      nodeInfoBar = new Konva.Group({
        width: NODE_WIDTH,
        height: infoBarHeight,
        y: nodeText.getHeight()
      });
      nodeInfoBarRect = new Konva.Rect({
        width: NODE_WIDTH - 5,
        x: 2.5,
        height: infoBarHeight - 2,
        fill: "#bbb",
        cornerRadius: 10
      });
      nodeInfoBar.add(nodeInfoBarRect);
      nodeInfoBar.add(nodeAuthorText);
      nodeInfoBar.add(nodeVoteBtnGroup);
      nodeRect = new Konva.Rect({
        name: "node-bg",
        stroke: '#555',
        strokeWidth: 5,
        fill: '#ddd',
        width: NODE_WIDTH,
        height: nodeText.getHeight() + infoBarHeight,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        cornerRadius: 10
      });
      nodeGroup = new Konva.Group({
        draggable: true,
        visible: false
      });
      if (node.sub_nodes.length > 0) {
        nodeRect2 = new Konva.Rect({
          x: 10,
          y: 10,
          name: "node-bg node-collapsed-bg",
          stroke: '#555',
          strokeWidth: 5,
          fill: '#ddd',
          width: NODE_WIDTH,
          height: nodeText.getHeight() + infoBarHeight,
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOffset: [10, 10],
          shadowOpacity: 0.2,
          cornerRadius: 10
        });
        nodeRect3 = new Konva.Rect({
          x: 20,
          y: 20,
          name: "node-bg node-collapsed-bg",
          stroke: '#555',
          strokeWidth: 5,
          fill: '#ddd',
          width: NODE_WIDTH,
          height: nodeText.getHeight() + infoBarHeight,
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOffset: [10, 10],
          shadowOpacity: 0.2,
          cornerRadius: 10
        });
        nodeGroup.add(nodeRect3);
        nodeGroup.add(nodeRect2);
      }
      nodeGroup.add(nodeRect);
      nodeGroup.add(nodeText);
      nodeGroup.add(nodeInfoBar);
      return nodeGroup;
    };
    layoutLevel = function(level, angleStart, parentNodes) {
      var angle, angleStep, base_offset_x, childNodes, first_angle, i, ind, j, k, len, len1, len2, parentNode, ref, spaceCount, spaceStart, subNode, subNodeCount, subNodeId;
      spaceCount = 0;
      if (parentNodes.length > 1) {
        spaceCount = parentNodes.length;
      }
      spaceStart = 0;
      for (ind = i = 0, len = parentNodes.length; i < len; ind = ++i) {
        parentNode = parentNodes[ind];
        subNodeCount = map_nodes[parentNode.getId()].sub_nodes.length;
        spaceCount += subNodeCount;
        if (ind === 0 && subNodeCount > 0) {
          spaceStart = -(subNodeCount - 1) / 2.0;
        }
      }
      angleStep = 2 * Math.PI / spaceCount;
      angle = angleStart + spaceStart * angleStep;
      base_offset_x = (stage.getWidth() - NODE_WIDTH) / 2;
      childNodes = [];
      first_angle = 0;
      for (j = 0, len1 = parentNodes.length; j < len1; j++) {
        parentNode = parentNodes[j];
        ref = map_nodes[parentNode.getId()].sub_nodes;
        for (k = 0, len2 = ref.length; k < len2; k++) {
          subNodeId = ref[k];
          subNode = getNode(subNodeId);
          subNode.setPosition({
            x: base_offset_x + Math.cos(angle) * NODE_WIDTH * level * 1.2,
            y: (stage.getHeight() - subNode.findOne('.node-bg').getHeight()) / 2 + Math.sin(angle) * NODE_WIDTH * level * 0.8
          });
          childNodes.push(subNode);
          if (childNodes.length === 1) {
            first_angle = angle;
          }
          angle += angleStep;
        }
        angle += angleStep;
      }
      if (childNodes.length > 0) {
        return layoutLevel(level + 1, first_angle, childNodes);
      }
    };
    layout = function() {
      var rootNode;
      rootNode = getNode(mapData.root_node_id);
      rootNode.show();
      rootNode.setPosition({
        x: (stage.getWidth() - NODE_WIDTH) / 2,
        y: (stage.getHeight() - rootNode.findOne('.node-bg').getHeight()) / 2
      });
      return layoutLevel(1, -Math.PI / 2, [rootNode]);
    };
    ref = mapData.node_list;
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      nodeId = "node-" + node.id;
      map_nodes[nodeId] = node;
      nodeGroup = buildNode(node);
      nodeGroup.setId(nodeId);
      nodeGroup.on('mousedown touchstart', function() {
        var bg, j, k, len1, len2, ref1, ref2;
        this.moveToTop();
        if (active_node === null || active_node !== this) {
          ref1 = this.find('.node-bg');
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            bg = ref1[j];
            bg.stroke('#375A7F');
          }
        }
        if (active_node !== null && active_node !== this) {
          ref2 = active_node.find('.node-bg');
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            bg = ref2[k];
            bg.stroke('#555');
          }
        }
        active_node = this;
        return stage.draw();
      });
      nodeGroup.on('dblclick dbltap', function() {
        toggleNode(this);
        return stage.draw();
      });
      layer.add(nodeGroup);
    }
    layout();
    return stage.add(layer);
  };

  init();

}).call(this);

//# sourceMappingURL=main.js.map
