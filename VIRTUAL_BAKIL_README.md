# Virtual Bakil - Professional Lawyer Booking System

## Overview
Virtual Bakil is a comprehensive lawyer booking system that provides users with a map-based interface to find, connect, and book consultations with nearby lawyers. The system features real-time location services, live chat, video calling, and seamless appointment booking.

## Key Features

### 🗺️ Interactive Map Interface
- **Real-time Location Services**: Automatic user location detection with permission handling
- **Lawyer Markers**: Custom animated markers showing lawyer locations with online status indicators
- **Search Radius Control**: Adjustable search radius from 1km to 10km
- **Responsive Design**: Optimized for both desktop and mobile devices

### 👨‍⚖️ Lawyer Discovery
- **Profile Display**: Comprehensive lawyer profiles with ratings, experience, and specializations
- **Online Status**: Real-time online/offline indicators with green animation for available lawyers
- **Search & Filter**: Find lawyers by location, specialization, and availability
- **Detailed Information**: Education, bar council registration, languages, and success rates

### 💬 Communication Features
- **Live Chat**: Real-time messaging with lawyers
- **Video Calling**: Professional video call interface with controls
- **Call Management**: Mute, camera toggle, call duration tracking
- **Session Management**: Proper session handling and cleanup

### 📅 Booking System
- **Instant Booking**: Direct appointment booking from lawyer profiles
- **API Integration**: Seamless integration with existing booking system
- **Confirmation**: Real-time booking confirmations and notifications

### 🌙 Dark Mode Support
- **Theme Integration**: Full compatibility with existing dark mode system
- **Responsive UI**: Consistent styling across all components
- **Modal Theming**: Dark mode support for all modals and overlays

## Technical Implementation

### Dependencies
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "@react-leaflet/core": "^3.0.0",
  "framer-motion": "^12.12.1",
  "lucide-react": "^0.508.0"
}
```

### API Integration
The system integrates with the following API endpoints:

#### Lawyer APIs
- `GET /api/lawyers/nearby` - Get nearby lawyers by location
- `GET /api/lawyers/{id}/status` - Get lawyer's online status
- `POST /api/lawyers/{id}/call/start` - Start video call session
- `POST /api/lawyers/{id}/chat/start` - Start chat session
- `POST /api/lawyers/{id}/chat/message` - Send chat message
- `POST /appointments/` - Book appointment

#### Location Services
- Browser Geolocation API for user location
- Reverse geocoding for address resolution
- Distance calculation for nearby lawyers

### Component Structure
```
VirtualBakil/
├── LocationMarker - User location marker
├── LawyerMarker - Lawyer location markers
├── LawyerDetailsModal - Lawyer profile modal
├── CallModal - Video call interface
├── ChatModal - Chat interface
├── LocationModal - Location permission modal
└── SearchingModal - Loading animation
```

## Usage Guide

### 1. Location Permission
When users first access the component, they'll be prompted to allow location access. This enables:
- Automatic location detection
- Nearby lawyer search
- Distance-based filtering

### 2. Map Navigation
- **Zoom**: Use mouse wheel or pinch gestures
- **Pan**: Click and drag to move around the map
- **Markers**: Click on lawyer markers to view profiles
- **Search Radius**: Adjust using the slider in the top-right overlay

### 3. Lawyer Interaction
- **View Profile**: Click on any lawyer marker
- **Start Call**: Click "Call Now" button for online lawyers
- **Start Chat**: Click "Chat" button for real-time messaging
- **Book Appointment**: Click "Book" for appointment scheduling

### 4. Communication Features
- **Video Calls**: Full-screen video interface with controls
- **Chat**: Real-time messaging with typing indicators
- **Session Management**: Automatic session cleanup

## Mobile Optimization

### Responsive Design
- **Mobile-First**: Optimized layouts for small screens
- **Touch-Friendly**: Large touch targets and gestures
- **Adaptive UI**: Collapsible overlays on mobile
- **Performance**: Optimized map rendering for mobile devices

### Mobile Features
- **Geolocation**: Native GPS integration
- **Touch Controls**: Pinch-to-zoom and swipe gestures
- **Modal Optimization**: Full-screen modals on mobile
- **Performance**: Lazy loading and efficient rendering

## Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

### Sample Data
The system includes sample lawyer data for development and testing:
- 5 sample lawyers with different specializations
- Realistic ratings and reviews
- Various online statuses and availability

### API Integration
To integrate with your backend:
1. Update API endpoints in `apiService.js`
2. Modify data transformation in `handleLocationAllow`
3. Customize lawyer data structure as needed

## Styling

### CSS Classes
```css
.custom-lawyer-marker - Custom map marker styling
.modal-scroll - Custom scrollbar for modals
.leaflet-popup-content-wrapper - Map popup styling
```

### Theme Support
- Full dark mode compatibility
- Consistent color scheme
- Responsive typography
- Smooth transitions

## Performance Considerations

### Map Optimization
- Efficient marker clustering
- Lazy loading of lawyer data
- Optimized re-renders
- Memory management for large datasets

### API Optimization
- Debounced search requests
- Caching for frequently accessed data
- Fallback to sample data
- Error handling and recovery

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### Planned Features
- **Advanced Filtering**: By specialization, rating, price range
- **Lawyer Reviews**: User reviews and ratings system
- **Appointment History**: Past consultations and bookings
- **Payment Integration**: Secure payment processing
- **Multi-language Support**: Localization for different regions
- **Push Notifications**: Real-time notifications for appointments
- **Advanced Analytics**: Usage statistics and insights

### Technical Improvements
- **WebRTC Integration**: Direct peer-to-peer video calling
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: PWA capabilities for offline access
- **Advanced Search**: Elasticsearch integration
- **ML Recommendations**: AI-powered lawyer recommendations

## Support
For technical support or feature requests, please contact the development team or create an issue in the project repository.