import React, { useState } from 'react';

function ProjectExplorer({ files, onFileSelect, onRenameFile, onToggleFolder, onAddItem, onMoveItem }) {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [draggedItemId, setDraggedItemId] = useState(null);

  const handleDoubleClick = (item) => {
    setEditingId(item.id);
    setEditingName(item.title);
  };

  const handleChange = (event) => {
    setEditingName(event.target.value);
  };

  const handleBlur = () => {
    if (editingName.trim() !== "") {
      onRenameFile(editingId, editingName);
    }
    setEditingId(null);
    setEditingName("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItemId(item.id);
    e.dataTransfer.setData('application/reactflow', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== targetItem.id && targetItem.type === 'folder') {
      onMoveItem(draggedItemId, targetItem.id);
      setDraggedItemId(null);
    }
  };

  const renderItems = (items, depth = 0) => {
    const sortedItems = sortItems([...items]);
    return sortedItems.map((item) => {
      const isEditing = editingId === item.id;
      const indentStyle = { paddingLeft: `${20}px`, paddingTop: '5px', cursor: 'pointer', listStyleType: 'none' };

      return (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          style={indentStyle}>
          {item.type === 'folder' ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleFolder(item.id); // Toggle folder expanded state
              }}>
              {isEditing ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              ) : item.title}
              {item.children && item.expanded && <li style={{ paddingLeft: '5px' }}>{renderItems(item.children, depth + 1)}</li>}
            </div>
          ) : (
            <li onDoubleClick={() => handleDoubleClick(item)} onClick={() => onFileSelect(item)}>
              {isEditing ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              ) : item.title}
            </li>
          )}
        </div>
      );
    });
  };

  const sortItems = (items) => {
    return items.sort((a, b) => {
      if (a.type === b.type) {
        return a.title.localeCompare(b.title);
      }
      return a.type === 'folder' ? -1 : 1;
    });
  };

  return <div>{renderItems(files)}</div>;
}

export default ProjectExplorer;
