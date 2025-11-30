import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
  permissions?: string;
}

interface FileManagerProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const MOCK_FILES: FileItem[] = [
  { name: '..', type: 'directory' },
  { name: 'Documents', type: 'directory', modified: '2025-11-28 14:30', permissions: 'drwxr-xr-x' },
  { name: 'Downloads', type: 'directory', modified: '2025-11-29 09:15', permissions: 'drwxr-xr-x' },
  { name: 'Pictures', type: 'directory', modified: '2025-11-27 18:45', permissions: 'drwxr-xr-x' },
  { name: 'config.json', type: 'file', size: 2048, modified: '2025-11-30 10:20', permissions: '-rw-r--r--' },
  { name: 'notes.txt', type: 'file', size: 512, modified: '2025-11-29 16:30', permissions: '-rw-r--r--' },
  { name: 'script.sh', type: 'file', size: 1024, modified: '2025-11-28 12:00', permissions: '-rwxr-xr-x' },
];

export function FileManager({ currentPath, onNavigate }: FileManagerProps) {
  const [files] = useState<FileItem[]>(MOCK_FILES);
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = theme.colors[colorScheme];

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const renderItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity 
      style={[styles.fileItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        if (item.type === 'directory') {
          onNavigate(item.name === '..' ? '/parent' : `${currentPath}/${item.name}`);
        }
      }}
    >
      <MaterialIcons 
        name={item.type === 'directory' ? 'folder' : 'insert-drive-file'} 
        size={24} 
        color={item.type === 'directory' ? colors.accent : colors.textSecondary}
      />
      
      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, { color: colors.text }]}>{item.name}</Text>
        {item.permissions && (
          <Text style={[styles.fileDetails, { color: colors.textSecondary }]}>
            {item.permissions} · {formatSize(item.size)} · {item.modified}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.menuButton}>
        <MaterialIcons name="more-vert" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.pathBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <MaterialIcons name="folder-open" size={20} color={colors.primary} />
        <Text style={[styles.pathText, { color: colors.text }]}>{currentPath}</Text>
      </View>

      <View style={[styles.toolbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.toolButton}>
          <MaterialIcons name="create-new-folder" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <MaterialIcons name="note-add" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <MaterialIcons name="file-upload" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <MaterialIcons name="file-download" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <MaterialIcons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}_${index}`}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pathBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
  },
  pathText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.mono,
  },
  toolbar: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
  },
  toolButton: {
    padding: theme.spacing.sm,
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderBottomWidth: 1,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.xs,
  },
  fileDetails: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.mono,
  },
  menuButton: {
    padding: theme.spacing.xs,
  },
});
