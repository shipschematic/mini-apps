export interface CardConfig {
  id: string
  key: string
  name: string
  title: string
  subtitle: string
  estimatedTime: string
  quantity: string
  creator: string
  category: string
  authorName: string
  uploadDate: string
  hasCrown: boolean
  imageUrl?: string
}

export const CARD_CONFIGS: CardConfig[] = [
  {
    id: '1',
    key: 'soup_ramen',
    name: 'Beef Ramen',
    title: 'Beef Ramen',
    subtitle: '52K Views',
    estimatedTime: '35 Min',
    quantity: '1 Serve',
    creator: 'by Tania Adams',
    category: 'Soup',
    authorName: 'Gabriel',
    uploadDate: '20 October 2022',
    hasCrown: false,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    key: 'soup_tomato',
    name: 'Tomato Soup',
    title: 'Tomato Soup',
    subtitle: '12K Views',
    estimatedTime: '15 Min',
    quantity: '2 Serves',
    creator: 'by Chef Gordon',
    category: 'Soup',
    authorName: 'Gordon',
    uploadDate: '12 September 2023',
    hasCrown: true,
    imageUrl: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    key: 'grill_steak',
    name: 'Grilled Steak',
    title: 'Ribeye Steak',
    subtitle: '98K Views',
    estimatedTime: '25 Min',
    quantity: '1 Serve',
    creator: 'by Bobby Flay',
    category: 'Grill',
    authorName: 'Bobby',
    uploadDate: '01 June 2024',
    hasCrown: true,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    key: 'grill_bbq',
    name: 'BBQ Ribs',
    title: 'Glazed BBQ Ribs',
    subtitle: '45K Views',
    estimatedTime: '45 Min',
    quantity: '3 Serves',
    creator: 'by Smokehouse Joe',
    category: 'Grill',
    authorName: 'Joe',
    uploadDate: '15 July 2024',
    hasCrown: false,
    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    key: 'dessert_lava',
    name: 'Lava Cake',
    title: 'Choco Lava Cake',
    subtitle: '110K Views',
    estimatedTime: '20 Min',
    quantity: '1 Serve',
    creator: 'by Pastry Queen',
    category: 'Dessert',
    authorName: 'Sarah',
    uploadDate: '05 May 2024',
    hasCrown: true,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    key: 'dessert_cheesecake',
    name: 'Cheesecake',
    title: 'Strawberry Cheesecake',
    subtitle: '67K Views',
    estimatedTime: '60 Min',
    quantity: '8 Serves',
    creator: 'by Baker Sweet',
    category: 'Dessert',
    authorName: 'Emily',
    uploadDate: '10 January 2025',
    hasCrown: false,
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop'
  },
  {
    id: '7',
    key: 'salad_caesar',
    name: 'Caesar Salad',
    title: 'Classic Caesar Salad',
    subtitle: '34K Views',
    estimatedTime: '10 Min',
    quantity: '2 Serves',
    creator: 'by Green Leaf',
    category: 'Salad',
    authorName: 'Oliver',
    uploadDate: '22 March 2024',
    hasCrown: false,
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop'
  },
  {
    id: '8',
    key: 'salad_greek',
    name: 'Greek Salad',
    title: 'Greek Feta Salad',
    subtitle: '22K Views',
    estimatedTime: '12 Min',
    quantity: '2 Serves',
    creator: 'by Healthy Eats',
    category: 'Salad',
    authorName: 'Nigella',
    uploadDate: '14 February 2024',
    hasCrown: false,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'
  },
  {
    id: '9',
    key: 'drink_smoothie',
    name: 'Mango Smoothie',
    title: 'Tropical Mango Smoothie',
    subtitle: '15K Views',
    estimatedTime: '5 Min',
    quantity: '1 Serve',
    creator: 'by Juice Bar',
    category: 'Drink',
    authorName: 'Tommy',
    uploadDate: '30 August 2024',
    hasCrown: false,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop'
  },
  {
    id: '10',
    key: 'drink_mojito',
    name: 'Classic Mojito',
    title: 'Classic Mint Mojito',
    subtitle: '28K Views',
    estimatedTime: '8 Min',
    quantity: '1 Serve',
    creator: 'by Mixologist Max',
    category: 'Drink',
    authorName: 'Max',
    uploadDate: '18 December 2024',
    hasCrown: true,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop'
  },
  {
    id: '11',
    key: 'breakfast_toast',
    name: 'Avocado Toast',
    title: 'Avocado Toast & Egg',
    subtitle: '78K Views',
    estimatedTime: '15 Min',
    quantity: '1 Serve',
    creator: 'by Brunch Cafe',
    category: 'Breakfast',
    authorName: 'Clara',
    uploadDate: '02 November 2024',
    hasCrown: false,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop'
  },
  {
    id: '12',
    key: 'breakfast_pancakes',
    name: 'Fluffy Pancakes',
    title: 'Maple Butter Pancakes',
    subtitle: '102K Views',
    estimatedTime: '20 Min',
    quantity: '2 Serves',
    creator: 'by Pancake House',
    category: 'Breakfast',
    authorName: 'Gabriel',
    uploadDate: '25 December 2024',
    hasCrown: true,
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop'
  }
]

export const getCardConfig = (id: string): CardConfig | undefined => {
  return CARD_CONFIGS.find(card => card.id === id)
}