import { View, Text } from '@tarojs/components'
import './index.scss'

interface DigitalLibraryProps {
  data?: {
    books?: Array<{
      id: string
      title: string
      author: string
      cover: string
      format: string
      size: string
    }>
  }
  config?: any
}

export default function DigitalLibrary({ data, config }: DigitalLibraryProps) {
  const books = data?.books || []

  return (
    <View className="digital-library">
      <Text className="section-title">My Digital Library</Text>
      {books.length === 0 ? (
        <View className="empty-library">
          <Text>No digital books yet</Text>
        </View>
      ) : (
        books.map((book) => (
          <View key={book.id} className="book-item">
            <View className="book-cover">
              <Text className="format-badge">{book.format}</Text>
            </View>
            <View className="book-info">
              <Text className="book-title">{book.title}</Text>
              <Text className="book-author">{book.author}</Text>
              <Text className="book-size">{book.size}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  )
}
