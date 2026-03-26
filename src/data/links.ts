export interface LinkItem {
  id: string;
  title: string;
  url: string;
  clickCount: number;
  createdAt: string;
}

export const dummyLinks: LinkItem[] = [
  {
    id: 'link-1',
    title: 'Instagram',
    url: 'https://instagram.com/example_user',
    clickCount: 150,
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
  },
  {
    id: 'link-2',
    title: 'YouTube',
    url: 'https://youtube.com/@example_channel',
    clickCount: 320,
    createdAt: new Date('2024-01-05T14:30:00Z').toISOString(),
  },
  {
    id: 'link-3',
    title: '블로그 (Blog)',
    url: 'https://blog.example.com',
    clickCount: 45,
    createdAt: new Date('2024-02-10T09:15:00Z').toISOString(),
  },
  {
    id: 'link-4',
    title: 'GitHub',
    url: 'https://github.com/example',
    clickCount: 89,
    createdAt: new Date('2024-03-01T11:20:00Z').toISOString(),
  },
  {
    id: 'link-5',
    title: '포트폴리오 (Portfolio)',
    url: 'https://portfolio.example.com',
    clickCount: 210,
    createdAt: new Date('2024-03-15T16:45:00Z').toISOString(),
  },
];
