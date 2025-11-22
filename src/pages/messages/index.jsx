import React, { useState } from "react";
import {
  MessageSquare,
  User,
  Package,
  ShoppingCart,
  Clock,
  Search,
} from "lucide-react";

const MessagesPage = () => {
  const [selectedSession, setSelectedSession] = useState(null);

  const sessions = [
    {
      id: 1,
      userName: "Sarah Johnson",
      lastMessage: "Thanks for the help!",
      time: "2 min ago",
      unread: 2,
      avatar: "SJ",
    },
    {
      id: 2,
      userName: "Michael Chen",
      lastMessage: "When will my order arrive?",
      time: "15 min ago",
      unread: 0,
      avatar: "MC",
    },
    {
      id: 3,
      userName: "Emma Davis",
      lastMessage: "I need to update my shipping address",
      time: "1 hour ago",
      unread: 1,
      avatar: "ED",
    },
    {
      id: 4,
      userName: "James Wilson",
      lastMessage: "Product recommendation please",
      time: "3 hours ago",
      unread: 0,
      avatar: "JW",
    },
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: "user",
        text: "Hi, I have a question about my recent order",
        time: "10:30 AM",
      },
      {
        id: 2,
        sender: "support",
        text: "Hello! I'd be happy to help. What's your order number?",
        time: "10:31 AM",
      },
      { id: 3, sender: "user", text: "It's #ORD-2024-1234", time: "10:32 AM" },
      {
        id: 4,
        sender: "support",
        text: "Thank you! I can see your order here. What would you like to know?",
        time: "10:33 AM",
      },
      {
        id: 5,
        sender: "user",
        text: "Can I change the delivery address?",
        time: "10:34 AM",
      },
      {
        id: 6,
        sender: "support",
        text: "Yes, I can help with that. What's the new address?",
        time: "10:35 AM",
      },
      {
        id: 7,
        sender: "user",
        text: "123 Oak Street, Portland, OR 97201",
        time: "10:36 AM",
      },
      {
        id: 8,
        sender: "support",
        text: "Perfect! I've updated your delivery address. Is there anything else I can help with?",
        time: "10:37 AM",
      },
      { id: 9, sender: "user", text: "Thanks for the help!", time: "10:38 AM" },
    ],
  };

  const sessionDetails = {
    1: {
      summary:
        "Customer requested address change for order #ORD-2024-1234. Successfully updated delivery address to new location in Portland.",
      user: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 123-4567",
        location: "Portland, OR",
        customerSince: "Jan 2023",
      },
      recommendedProducts: [
        { id: 1, name: "Nike X shoes", price: "$129.99" },
        { id: 2, name: "Red Treking High Sneaker", price: "$299.99" },
        { id: 3, name: "Running Long Shoe", price: "$49.99" },
      ],
      order: {
        orderId: "#ORD-2024-1234",
        status: "Processing",
        total: "$459.97",
        items: 3,
        date: "Nov 20, 2024",
      },
    },
  };

  return (
    <div className="flex h-[calc(100%)] rounded-xl overflow-hidden border">
      {/* Left Sidebar - Sessions List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className={`p-4 border-b border-l-4 border-gray-100 cursor-pointer ${
                selectedSession === session.id
                  ? "bg-primary/5 border-l-primary"
                  : "hover:bg-gray-50 border-l-transparent tr"
              }`}
            >
              <div className="flx gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-sm text-primary center font-medium">
                  {session.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {session.userName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {session.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {session.lastMessage}
                  </p>
                </div>
                {session.unread > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {session.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {selectedSession ? (
        <>
          {/* Middle Section - Message History */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 center text-primary font-semibold">
                  {sessions.find((s) => s.id === selectedSession)?.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {sessions.find((s) => s.id === selectedSession)?.userName}
                  </h2>
                  <p className="text-sm text-emerald-600">Active now</p>
                </div>
              </div>
            </div>

            <div className="flex-1 custom-scrollbar p-6 space-y-4">
              {messages[selectedSession]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "support"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md ${
                      message.sender === "support" ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.sender === "support"
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p
                      className={`text-[10px] text-gray-500 mt-1 ${
                        message.sender === "support"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-emerald-800 transition-colors font-medium">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Details */}
          <div className="w-96 bg-white border-l border-gray-200 custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Conversation Summary
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {sessionDetails[selectedSession]?.summary}
                </p>
              </div>

              {/* User Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {sessionDetails[selectedSession]?.user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">
                      {sessionDetails[selectedSession]?.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">
                      {sessionDetails[selectedSession]?.user.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">
                      {sessionDetails[selectedSession]?.user.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer Since</p>
                    <p className="text-sm text-gray-900">
                      {sessionDetails[selectedSession]?.user.customerSince}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Recommended Products
                </h3>
                <div className="space-y-2">
                  {sessionDetails[selectedSession]?.recommendedProducts.map(
                    (product) => (
                      <div
                        key={product.id}
                        className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {product.price}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Select a conversation
            </h2>
            <p className="text-gray-500">
              Choose a message from the left to view details
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
