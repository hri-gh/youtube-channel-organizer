'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { Channel } from './ChannelCard'

interface ChannelFormProps {
  channel?: Channel | null
  existingTags: string[]
  onSave: (channel: Omit<Channel, 'id'>) => void
  onCancel: () => void
}

export function ChannelForm({ channel, existingTags, onSave, onCancel }: ChannelFormProps) {
  const [formData, setFormData] = useState({
    link: '',
    name: '',
    tags: [] as string[],
    note: '',
    favourite: false
  })
  const [newTag, setNewTag] = useState('')
  const [filteredTags, setFilteredTags] = useState<string[]>([])

  // Initialize form with channel data if editing
  useEffect(() => {
    if (channel) {
      setFormData({
        link: channel.link,
        name: channel.name || '',
        tags: [...channel.tags],
        note: channel.note || '',
        favourite: channel.favourite || false
      })
    }
  }, [channel])

  // Filter existing tags based on input
  useEffect(() => {
    if (newTag) {
      const filtered = existingTags.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase()) &&
        !formData.tags.includes(tag)
      )
      setFilteredTags(filtered)
    } else {
      setFilteredTags([])
    }
  }, [newTag, existingTags, formData.tags])

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      handleAddTag(newTag.trim())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.link.trim()) return

    onSave({
      link: formData.link.trim(),
      name: formData.name.trim() || undefined,
      tags: formData.tags,
      note: formData.note.trim() || undefined,
      favourite: formData.favourite
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Link Field */}
      <div className="space-y-2">
        <Label htmlFor="link">YouTube Channel Link *</Label>
        <Input
          id="link"
          type="url"
          placeholder="https://www.youtube.com/@channelname"
          value={formData.link}
          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
          required
        />
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Channel Name (Optional)</Label>
        <Input
          id="name"
          placeholder="Enter channel name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {/* Tags Field */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        
        {/* Selected Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Tag Input */}
        <div className="relative">
          <Input
            id="tags"
            placeholder="Type to add or search tags..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          {/* Tag Suggestions */}
          {(filteredTags.length > 0 || (newTag.trim() && !existingTags.includes(newTag.trim()) && !formData.tags.includes(newTag.trim()))) && (
            <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
              {filteredTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                >
                  {tag}
                </button>
              ))}
              {newTag.trim() && !existingTags.includes(newTag.trim()) && !formData.tags.includes(newTag.trim()) && (
                <button
                  type="button"
                  onClick={() => handleAddTag(newTag.trim())}
                  className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-t flex items-center gap-2"
                >
                  <Plus className="w-3 h-3" />
                  Create "{newTag.trim()}"
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Note Field */}
      <div className="space-y-2">
        <Label htmlFor="note">Note (Optional)</Label>
        <Textarea
          id="note"
          placeholder="Add any notes about this channel..."
          value={formData.note}
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
          rows={3}
        />
      </div>

      {/* Favourite Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="favourite"
          checked={formData.favourite}
          onChange={(e) => setFormData(prev => ({ ...prev, favourite: e.target.checked }))}
        />
        <Label htmlFor="favourite">Mark as favourite</Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {channel ? 'Update Channel' : 'Add Channel'}
        </Button>
      </div>
    </form>
  )
}