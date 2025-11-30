'use client'

import { useState, useEffect, useMemo } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Sidebar } from '@/components/layout/Sidebar'
import { ChannelList } from '@/components/list/ChannelList'
import { Channel } from '@/components/data-display/ChannelCard'
import { ChannelForm } from '@/components/data-display/ChannelForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import sampleData from '@/lib/sample-data.json'

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const [standaloneTags, setStandaloneTags] = useState<string[]>([])

  // Load data from localStorage or use sample data
  useEffect(() => {
    const savedChannels = localStorage.getItem('youtube-channels')
    const savedStandaloneTags = localStorage.getItem('youtube-standalone-tags')
    
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels))
    } else {
      setChannels(sampleData as Channel[])
    }
    
    if (savedStandaloneTags) {
      setStandaloneTags(JSON.parse(savedStandaloneTags))
    }
  }, [])

  // Save to localStorage whenever channels change
  useEffect(() => {
    if (channels.length > 0) {
      localStorage.setItem('youtube-channels', JSON.stringify(channels))
    }
  }, [channels])

  // Save standalone tags to localStorage
  useEffect(() => {
    localStorage.setItem('youtube-standalone-tags', JSON.stringify(standaloneTags))
  }, [standaloneTags])

  // Get all unique tags and their counts
  const { allTags, tagCounts } = useMemo(() => {
    const tagSet = new Set<string>()
    const counts: Record<string, number> = {}
    
    // Add tags from channels
    channels.forEach(channel => {
      channel.tags.forEach(tag => {
        tagSet.add(tag)
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    
    // Add standalone tags (with 0 count)
    standaloneTags.forEach(tag => {
      tagSet.add(tag)
      if (!counts[tag]) {
        counts[tag] = 0
      }
    })
    
    return {
      allTags: Array.from(tagSet).sort(),
      tagCounts: counts
    }
  }, [channels, standaloneTags])

  const handleAddChannel = () => {
    setEditingChannel(null)
    setIsModalOpen(true)
  }

  const handleEditChannel = (channel: Channel) => {
    setEditingChannel(channel)
    setIsModalOpen(true)
  }

  const handleDeleteChannel = (channel: Channel) => {
    if (confirm(`Are you sure you want to delete "${channel.name || 'this channel'}"?`)) {
      setChannels(prev => prev.filter(ch => ch.id !== channel.id))
    }
  }

  const handleSaveChannel = (channelData: Omit<Channel, 'id'>) => {
    if (editingChannel) {
      // Update existing channel
      setChannels(prev => prev.map(ch => 
        ch.id === editingChannel.id 
          ? { ...channelData, id: editingChannel.id }
          : ch
      ))
    } else {
      // Add new channel
      const newChannel: Channel = {
        ...channelData,
        id: Date.now().toString()
      }
      setChannels(prev => [...prev, newChannel])
    }
    
    // Remove any standalone tags that are now used in channels
    const usedTags = new Set<string>()
    channels.forEach(channel => {
      channel.tags.forEach(tag => usedTags.add(tag))
    })
    channelData.tags.forEach(tag => usedTags.add(tag))
    
    setStandaloneTags(prev => prev.filter(tag => !usedTags.has(tag)))
    
    setIsModalOpen(false)
    setEditingChannel(null)
  }

  const handleCreateTag = (tagName: string) => {
    if (!allTags.includes(tagName)) {
      setStandaloneTags(prev => [...prev, tagName])
    }
  }

  const handleRenameTag = (oldTag: string, newTag: string) => {
    // Update channels
    setChannels(prev => prev.map(channel => ({
      ...channel,
      tags: channel.tags.map(tag => tag === oldTag ? newTag : tag)
    })))
    
    // Update standalone tags
    setStandaloneTags(prev => prev.map(tag => tag === oldTag ? newTag : tag))
    
    // Update selected tag if it was the renamed one
    if (selectedTag === oldTag) {
      setSelectedTag(newTag)
    }
  }

  const handleDeleteTag = (tagToDelete: string) => {
    // Remove from channels
    setChannels(prev => prev.map(channel => ({
      ...channel,
      tags: channel.tags.filter(tag => tag !== tagToDelete)
    })))
    
    // Remove from standalone tags
    setStandaloneTags(prev => prev.filter(tag => tag !== tagToDelete))
    
    // Clear selected tag if it was the deleted one
    if (selectedTag === tagToDelete) {
      setSelectedTag(null)
    }
  }

  const sidebar = (
    <Sidebar
      tags={allTags}
      selectedTag={selectedTag}
      onTagSelect={setSelectedTag}
      tagCounts={tagCounts}
      onCreateTag={handleCreateTag}
      onRenameTag={handleRenameTag}
      onDeleteTag={handleDeleteTag}
    />
  )

  return (
    <PageContainer sidebar={sidebar}>
      <div className="py-8">
        <ChannelList
          channels={channels}
          selectedTag={selectedTag}
          onAddChannel={handleAddChannel}
          onEditChannel={handleEditChannel}
          onDeleteChannel={handleDeleteChannel}
        />
      </div>
      
      {/* Channel Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader onClose={() => setIsModalOpen(false)}>
            <DialogTitle>
              {editingChannel ? 'Edit Channel' : 'Add Channel'}
            </DialogTitle>
          </DialogHeader>
          
          <ChannelForm
            channel={editingChannel}
            existingTags={allTags}
            onSave={handleSaveChannel}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}