/**
 * Helper utility for personalized time-based greetings (صباح الخير / مساء الخير)
 */

export interface GreetingInfo {
  greeting: string;
  salutation: string;
  icon: string;
  timePeriod: 'morning' | 'afternoon' | 'evening' | 'night';
  formattedTime: string;
}

export function getTimeGreeting(name?: string, lang: 'ar' | 'en' = 'ar'): GreetingInfo {
  const now = new Date();
  const hour = now.getHours();
  
  let timePeriod: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
  let salutation = 'صباح الخير';
  let icon = '☀️';

  if (hour >= 5 && hour < 12) {
    timePeriod = 'morning';
    salutation = lang === 'ar' ? 'صباح الخير والبركة' : 'Good morning';
    icon = '☀️';
  } else if (hour >= 12 && hour < 17) {
    timePeriod = 'afternoon';
    salutation = lang === 'ar' ? 'مساء الخير والسرور' : 'Good afternoon';
    icon = '🌤️';
  } else if (hour >= 17 && hour < 22) {
    timePeriod = 'evening';
    salutation = lang === 'ar' ? 'مساء الخير والأنوار' : 'Good evening';
    icon = '🌙';
  } else {
    timePeriod = 'night';
    salutation = lang === 'ar' ? 'مساء الخير والراحة' : 'Good night';
    icon = '✨';
  }

  const cleanName = name?.trim();
  let greeting = '';

  if (lang === 'ar') {
    greeting = cleanName ? `${salutation} يا ${cleanName}` : salutation;
  } else {
    greeting = cleanName ? `${salutation}, ${cleanName}` : salutation;
  }

  const formattedTime = now.toLocaleTimeString(lang === 'ar' ? 'ar-YE' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    greeting,
    salutation,
    icon,
    timePeriod,
    formattedTime
  };
}

export function getMandoubGreeting(driverName: string = 'أحمد الكبسي', lang: 'ar' | 'en' = 'ar'): string {
  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 12;

  if (lang === 'ar') {
    return isMorning 
      ? `صباح الخير والنشاط يا كابتن ${driverName} ☀️`
      : `مساء الخير والهمة العالية يا كابتن ${driverName} 🌙`;
  } else {
    return isMorning 
      ? `Good morning, Captain ${driverName} ☀️`
      : `Good evening, Captain ${driverName} 🌙`;
  }
}
