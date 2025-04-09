// Default avatar using a more maintainable approach
export const getDefaultAvatar = (name = '') => {
  // If name is provided, create an avatar with initials
  if (name && name.length > 0) {
    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    // Generate a consistent color based on the name
    const colors = [
      '#1E40AF', // blue-800
      '#1D4ED8', // blue-700
      '#2563EB', // blue-600
      '#3B82F6', // blue-500
      '#60A5FA', // blue-400
    ];
    
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];
    
    return {
      type: 'initial',
      initials,
      bgColor
    };
  }
  
  // Default SVG avatar
  return {
    type: 'image',
    url: '/default-avatar.png', // Store this in your public folder
    fallback: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS45OSAwIDUuOTcgMS4wOSA2IDMuMDgtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48L3N2Zz4='
  };
};