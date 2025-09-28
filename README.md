# 🚀 Next.js Blog Application

A modern, responsive blog application built with Next.js 15, featuring a clean design, dynamic routing, and an admin panel for content management.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🏠 **Frontend Features**
- **Responsive Design** - Fully responsive layout that works on all devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Dynamic Blog Listings** - Browse blogs by category (All, Technology, Startup, Lifestyle)
- **Individual Blog Pages** - Detailed blog post view with author information
- **Social Sharing** - Share articles on Facebook, Twitter, and Google+
- **SEO Optimized** - Structured for better search engine visibility
- **Fast Loading** - Optimized with Next.js Image component and performance best practices

### ⚡ **Blog Features**
- **Category Filtering** - Filter blogs by Technology, Startup, and Lifestyle categories
- **Author Profiles** - Display author information and profile pictures
- **Rich Content** - Support for formatted blog content with headings and paragraphs
- **Hero Images** - Featured images for each blog post
- **Reading Experience** - Optimized typography and layout for comfortable reading

### 🔧 **Admin Panel**
- **Admin Dashboard** - Dedicated admin interface with sidebar navigation
- **Content Management** - Add and manage blog posts
- **Blog List Management** - View and organize all blog entries
- **Subscription Management** - Handle newsletter subscriptions
- **Responsive Admin UI** - Mobile-friendly admin interface

### 🎨 **Technical Features**
- **Next.js 15** - Latest version with App Router
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Image Optimization** - Next.js Image component for optimized loading
- **Dynamic Routing** - URL-based navigation for blog posts (`/blogs/[id]`)
- **Component Architecture** - Modular, reusable React components
- **Modern JavaScript** - ES6+ features and React Hooks

## 🚀 Pre-deployment Requirements

> **⚠️ IMPORTANT: Before deploying, you MUST configure your MongoDB connection!**

**1. MongoDB Setup**
Before deploying this application, you need to set up MongoDB and configure the connection URL:

1. **Create a MongoDB Database:**
   - Use [MongoDB Atlas](https://www.mongodb.com/atlas) (recommended for cloud deployment)
   - Or set up a local MongoDB instance

2. **Get Your Connection URL:**
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

3. **Create Environment File:**
   Create a `.env.local` file in your project root and add:
   ```env
   MONGODB_URI=your_mongodb_connection_url_here
   ```

   **Example:**
   ```env
   MONGODB_URI=mongodb+srv://bloguser:mypassword@cluster0.example.mongodb.net/nextjs-blog?retryWrites=true&w=majority
   ```

4. **Environment Variables for Production:**
   When deploying to platforms like Vercel, Netlify, or others, make sure to add the `MONGODB_URI` environment variable in your deployment platform's settings.

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- **MongoDB database** (Atlas or local instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chathuraz/next-blog-app.git
   cd next-blog-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the project root:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database-name?retryWrites=true&w=majority
   ```
   
   **For local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/nextjs-blog
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🔧 MongoDB Configuration

### Setting up MongoDB Atlas (Recommended)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. **Create Cluster**: Create a new cluster (free tier available)
3. **Create Database User**: Add a database user with read/write permissions
4. **Whitelist IP**: Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)
5. **Get Connection String**: Copy your connection string and replace `<password>` with your user password

### Environment Variables

**Required Environment Variables:**
```env
MONGODB_URI=your_mongodb_connection_string
```

**Optional Environment Variables:**
```env
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### Troubleshooting MongoDB Connection

**Common Issues:**
- ❌ **"Connection refused"**: Check if your IP is whitelisted in MongoDB Atlas
- ❌ **"Authentication failed"**: Verify username and password in connection string
- ❌ **"Timeout"**: Check network connectivity and firewall settings
- ❌ **"Database not found"**: The database will be created automatically when first accessed

**Testing Connection:**
You can test your MongoDB connection by accessing any API route like `/api/blog` after starting the development server.

## 📁 Project Structure

```
next-blog-app/
├── app/                     # Next.js App Router
│   ├── admin/              # Admin panel routes
│   │   └── layout.jsx      # Admin layout
│   ├── blogs/              # Blog routes
│   │   └── [id]/          # Dynamic blog pages
│   ├── globals.css         # Global styles
│   ├── layout.jsx          # Root layout
│   └── page.jsx            # Homepage
├── Assets/                 # Static assets
│   └── assets.js          # Asset exports
├── Components/             # React components
│   ├── AdminComponents/    # Admin-specific components
│   │   └── sidebar.jsx    # Admin sidebar
│   ├── BlogItem.jsx       # Blog card component
│   ├── BlogList.jsx       # Blog listing component
│   ├── Footer.jsx         # Footer component
│   └── Header.jsx         # Header component
└── public/                # Public assets
```

## 🎯 Usage

### Viewing Blogs
1. Visit the homepage to see all blog posts
2. Use category filters (Technology, Startup, Lifestyle) to narrow down posts
3. Click on any blog card to read the full article

### Admin Panel
1. Navigate to `/admin` to access the admin dashboard
2. Use the sidebar to:
   - Add new blog posts
   - View and manage existing blogs
   - Handle subscriptions

### Adding New Content
The application uses a static data structure. To add new blogs:
1. Update the `blog_data` array in your assets file
2. Include title, description, author, category, and image
3. The new content will automatically appear in listings

## 🔧 Customization

### Styling
- Modify `globals.css` for global styles
- Update Tailwind classes in components for design changes
- Customize colors, fonts, and spacing via Tailwind configuration

### Content
- Update blog data in the assets file
- Modify categories in `BlogList.jsx`
- Add new social media icons in the footer

### Layout
- Adjust responsive breakpoints in component classes
- Modify the admin sidebar layout
- Customize the blog post template

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🌟 Performance Features

- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic code splitting for faster page loads
- **SEO Ready** - Meta tags and structured content
- **Fast Refresh** - Instant feedback during development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chathura**
- GitHub: [@chathuraz](https://github.com/chathuraz)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- React community for continuous inspiration

---

⭐ **Star this repository if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/chathuraz/next-blog-app?style=social)](https://github.com/chathuraz/next-blog-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/chathuraz/next-blog-app?style=social)](https://github.com/chathuraz/next-blog-app/network)
