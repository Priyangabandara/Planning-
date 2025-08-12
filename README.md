# Planning Tool - Drag-and-Drop Production Planning

A modern web-based planning tool that combines drag-and-drop scheduling with real-time BOM (Bill of Materials) checking. Perfect for manufacturing and production planning workflows.

## 🚀 Features

- **📅 Drag-and-Drop Timeline** - Intuitive order scheduling with visual timeline
- **📦 BOM Integration** - Automatic material availability checking
- **🎨 Color-Coded Status** - Green for available, red for shortages
- **📊 Real-time Updates** - Instant feedback on schedule changes
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🔍 Material Management** - Track and update stock levels
- **⚡ Fast Performance** - Built with React and optimized for speed

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Drag & Drop**: React Beautiful DnD
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (with Supabase support)
- **Build Tool**: Vite
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd planning-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create a PostgreSQL database
   createdb planning_tool
   
   # Run the schema
   psql planning_tool < server/database.sql
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection
   ```

5. **Start the development servers**
   ```bash
   npm run dev:full
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx      # Main layout with navigation
│   │   └── LoadingSpinner.tsx
│   ├── pages/              # Page components
│   │   ├── PlanningBoard.tsx  # Main planning interface
│   │   ├── Materials.tsx      # Material inventory
│   │   └── NotFound.tsx       # 404 page
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── server/
│   ├── index.js            # Express API server
│   └── database.sql        # Database schema
└── public/                 # Static assets
```

## 🎯 Core Features

### Planning Board
- **Timeline View**: 30-day visual timeline with daily slots
- **Drag & Drop**: Move orders between dates with real-time updates
- **BOM Checking**: Automatic material availability verification
- **Status Indicators**: Color-coded order status (green/red)
- **Order Details**: Click to view detailed BOM information

### Materials Management
- **Stock Tracking**: Real-time inventory levels
- **Status Categories**: Good stock, low stock, out of stock
- **Quick Updates**: Inline editing of stock quantities
- **Visual Indicators**: Progress bars and status icons

## 🗄️ Database Schema

### Orders Table
```sql
orders | order_id | order_name | start_date | end_date | bom_id | status
```

### BOM Table
```sql
bom | bom_id | material_id | qty_required
```

### Materials Table
```sql
materials | material_id | material_name | stock_qty
```

## 🔌 API Endpoints

- `GET /api/orders` - Fetch orders with BOM information
- `POST /api/updateOrder` - Update order start/end dates
- `GET /api/bom/:orderId` - Get BOM details for specific order
- `GET /api/materials` - Get all materials with stock levels
- `PUT /api/materials/:id` - Update material stock quantity

## 🎨 Design System

- **Color Coding**: Green (available), Red (shortage), Orange (low stock)
- **Typography**: Inter font family for readability
- **Spacing**: Consistent 4px grid system
- **Animations**: Smooth transitions and drag feedback
- **Responsive**: Mobile-first design approach

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@localhost:5432/planning_tool
PORT=3001
NODE_ENV=development
```

### For Supabase Deployment
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend (Railway/Render)
1. Connect your repository
2. Set environment variables
3. Set start command: `npm run server`
4. Deploy

### Database (Supabase)
1. Create a new Supabase project
2. Run the database schema
3. Update environment variables
4. Connect your application

## 🔮 Future Enhancements

- [ ] Add real-time collaboration features
- [ ] Implement order dependencies and constraints
- [ ] Add machine/resource capacity planning
- [ ] Create detailed reporting and analytics
- [ ] Add user authentication and roles
- [ ] Implement order templates and recurring orders
- [ ] Add export functionality (PDF, Excel)
- [ ] Create mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Drag and drop by [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [PostgreSQL](https://www.postgresql.org/)

---

**Planning Tool** - Streamline your production planning with drag-and-drop simplicity! 🚀
