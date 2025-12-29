import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const ServiceCard = ({ 
  service, 
  index = 0,
  variant = 'blue' // 'blue', 'green', 'orange', 'yellow', 'purple'
}) => {
  const variants = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-400 to-blue-500',
      text: 'text-white',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-400 to-green-500',
      text: 'text-white',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-400 to-orange-500',
      text: 'text-white',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-300 to-yellow-400',
      text: 'text-gray-900',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-400 to-purple-500',
      text: 'text-white',
    },
    gray: {
      bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
      text: 'text-gray-900',
      border: 'border-2 border-gray-300',
    },
  };

  const style = variants[variant] || variants.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <Link to={(service._id || service.id) ? `/services/${service._id || service.id}` : '/services'}>
        <div
          className={`${style.bg} ${style.text} ${style.border || ''} rounded-3xl p-8 md:p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-between items-center cursor-pointer transition-all duration-300 shadow-wecasa hover:shadow-wecasa-hover`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 text-center w-full flex flex-col items-center">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-2 leading-tight text-center w-full pr-6 md:pr-8">
              {service.title || service.name}
            </h2>
            {service.subtitle && (
              <p className="text-2xl md:text-3xl font-semibold opacity-90 text-center w-full">
                {service.subtitle}
              </p>
            )}
            {service.description && (
              <p className="text-lg mt-4 opacity-80 leading-relaxed text-center w-full max-w-2xl">
                {service.description}
              </p>
            )}
          </div>

          {/* Arrow icon on hover */}
          <div className="relative z-10 mt-8 flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
            <ArrowRightIcon className="w-8 h-8" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;

