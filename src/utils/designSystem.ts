// Design System for consistent styling across all sections
export const designSystem = {
  // Section spacing
  sectionPadding: "py-24",
  containerPadding: "px-4",
  
  // Background patterns
  backgrounds: {
    primary: "bg-gradient-to-br from-blue-50 via-white to-blue-50",
    secondary: "bg-gradient-to-br from-gray-50 via-white to-blue-50", 
    dark: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    light: "bg-white"
  },
  
  // Typography
  typography: {
    sectionBadge: "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6",
    sectionTitle: "text-5xl md:text-6xl font-bold text-gray-900 mb-8",
    sectionSubtitle: "text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed",
    cardTitle: "text-2xl font-bold text-gray-900 mb-4",
    cardDescription: "text-gray-600 mb-6 leading-relaxed text-lg"
  },
  
  // Color schemes
  colors: {
    primary: "from-blue-600 to-blue-700",
    secondary: "from-emerald-600 to-emerald-700", 
    accent: "from-purple-600 to-purple-700",
    warning: "from-orange-600 to-orange-700",
    success: "from-green-600 to-green-700"
  },
  
  // Badge colors
  badgeColors: {
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-emerald-100 text-emerald-700",
    accent: "bg-purple-100 text-purple-700",
    warning: "bg-orange-100 text-orange-700",
    success: "bg-green-100 text-green-700"
  },
  
  // Card styling
  card: {
    base: "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 group border border-gray-100 relative overflow-hidden",
    padding: "p-8",
    hover: "hover:scale-1.01"
  },
  
  // Button styling
  buttons: {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-200",
    secondary: "border-2 border-blue-600 text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors duration-200",
    cta: "bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
  },
  
  // Optimized animation variants for better performance
  animations: {
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    },
    
    itemVariants: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94] as const
        }
      }
    },
    
    cardVariants: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94] as const
        }
      }
    }
  },
  
  // Background decorative elements
  decorativeElements: {
    floating: "absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float",
    floatingDelayed: "absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"
  }
};

// Helper function to get section-specific styling
export const getSectionStyling = (sectionType: 'hero' | 'about' | 'services' | 'vehicles' | 'sales' | 'contact') => {
  const baseStyling = {
    section: `${designSystem.sectionPadding} ${designSystem.backgrounds.primary} relative overflow-hidden`,
    container: `container mx-auto ${designSystem.containerPadding} relative z-10`,
    header: "text-center mb-20"
  };
  
  switch (sectionType) {
    case 'hero':
      return {
        ...baseStyling,
        section: `min-h-screen ${designSystem.backgrounds.primary} flex items-center relative overflow-hidden`,
        header: "text-center mb-16"
      };
    case 'about':
      return {
        ...baseStyling,
        section: `${designSystem.sectionPadding} ${designSystem.backgrounds.light}`,
        header: "text-center mb-16"
      };
    case 'services':
      return {
        ...baseStyling,
        section: `${designSystem.sectionPadding} ${designSystem.backgrounds.secondary} relative overflow-hidden`,
        header: "text-center mb-16"
      };
    case 'vehicles':
      return {
        ...baseStyling,
        section: `${designSystem.sectionPadding} ${designSystem.backgrounds.secondary} relative overflow-hidden`,
        header: "text-center mb-16"
      };
    case 'sales':
      return {
        ...baseStyling,
        section: `${designSystem.sectionPadding} ${designSystem.backgrounds.secondary} relative overflow-hidden`
      };
    case 'contact':
      return {
        ...baseStyling,
        section: `${designSystem.sectionPadding} ${designSystem.backgrounds.dark} text-white relative overflow-hidden`
      };
    default:
      return baseStyling;
  }
};
