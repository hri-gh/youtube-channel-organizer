'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/core/ThemeToggle'
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react'

interface SidebarProps {
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
  tagCounts: Record<string, number>
  onCreateTag: (tagName: string) => void
  onRenameTag: (oldTag: string, newTag: string) => void
  onDeleteTag: (tag: string) => void
}

export function Sidebar({ 
  tags, 
  selectedTag, 
  onTagSelect, 
  tagCounts, 
  onCreateTag, 
  onRenameTag, 
  onDeleteTag 
}: SidebarProps) {
  const [isCreatingTag, setIsCreatingTag] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editTagName, setEditTagName] = useState('')

  const handleCreateTag = () => {
    if (newTagName.trim() && !tags.includes(newTagName.trim())) {
      onCreateTag(newTagName.trim())
      setNewTagName('')
      setIsCreatingTag(false)
    }
  }

  const handleRenameTag = (oldTag: string) => {
    if (editTagName.trim() && editTagName.trim() !== oldTag && !tags.includes(editTagName.trim())) {
      onRenameTag(oldTag, editTagName.trim())
      setEditingTag(null)
      setEditTagName('')
    } else {
      setEditingTag(null)
      setEditTagName('')
    }
  }

  const startEditing = (tag: string) => {
    setEditingTag(tag)
    setEditTagName(tag)
  }

  const handleDeleteTag = (tag: string) => {
    if (confirm(`Are you sure you want to delete the tag "${tag}"? This will remove it from all channels.`)) {
      onDeleteTag(tag)
    }
  }

  return (
    <div className="w-64 border-r bg-muted/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tags</h2>
        <ThemeToggle />
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => onTagSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            selectedTag === null 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
        >
          All Channels
        </button>

        {/* Create Tag Section */}
        {isCreatingTag ? (
          <div className="flex items-center gap-1 px-3 py-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name"
              className="h-7 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
              autoFocus
            />
            <Button
              size="icon-sm"
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || tags.includes(newTagName.trim())}
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setIsCreatingTag(false)
                setNewTagName('')
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreatingTag(true)}
            className="w-full justify-start text-sm h-8"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tag
          </Button>
        )}
        
        {tags.map((tag) => (
          <div key={tag} className="group relative">
            {editingTag === tag ? (
              <div className="flex items-center gap-1 px-3 py-2">
                <Input
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  className="h-7 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleRenameTag(tag)}
                  autoFocus
                />
                <Button
                  size="icon-sm"
                  onClick={() => handleRenameTag(tag)}
                  disabled={!editTagName.trim() || editTagName.trim() === tag || tags.includes(editTagName.trim())}
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingTag(null)
                    setEditTagName('')
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={() => onTagSelect(tag)}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                    selectedTag === tag 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <span>{tag}</span>
                  <span className="text-xs opacity-70">
                    {tagCounts[tag] || 0}
                  </span>
                </button>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => startEditing(tag)}
                    className="h-6 w-6"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleDeleteTag(tag)}
                    className="h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}