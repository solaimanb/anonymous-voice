'use client';

import { useState } from 'react';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/button';

const placeholderAvatar = 'https://via.placeholder.com/150';

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string>('3');

  const chats = [
    {
      id: '1',
      name: 'Adam West',
      avatar: placeholderAvatar,
      lastMessage: '4d',
      hasHeart: true,
    },
    {
      id: '2',
      name: 'Brian Griffin',
      avatar: placeholderAvatar,
      lastMessage: 'Yay, this will be the best....',
    },
    {
      id: '3',
      name: 'Lois Griffin',
      avatar: placeholderAvatar,
      lastMessage: 'Yay, this will be the best....',
    },
  ];

  const messages = [
    {
      id: '1',
      content: "Hahaha it's all good! I'm here another 10 days. Just house/dog sitting today through Saturday still. Then here another week after that before I come home.",
      isOutgoing: false,
    },
    {
      id: '2',
      content: "Nice! Let's try and grab lunch next week. What's in Colorado for you?",
      isOutgoing: true,
    },
    {
      id: '3',
      content: "Peter, you know my family lives here.",
      isOutgoing: false,
    },
    {
      id: '4',
      content: "You're welcome to join me next time. It would be nice for you to see them. It's been years. But you need to behave...",
      isOutgoing: false,
    },
    {
      id: '5',
      content: "Gosh, it's not like me to do anything crazy or stupid.",
      isOutgoing: true,
    },
  ];

  const activeUser = {
    name: 'Lois Griffin',
    avatar: placeholderAvatar,
  };

  return (
    <ChatLayout>
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow
          user={activeUser}
          messages={messages}
          onSendMessage={console.log}
        />
        <div className="fixed top-4 right-4 space-y-2">
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Completed
          </Button>
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </ChatLayout>
  );
}
