'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X, FileText, Shield } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const TermsModal = ({ isOpen, onClose, type }: TermsModalProps) => {
  const isTerms = type === 'terms';
  const title = isTerms ? 'Terms and Conditions' : 'Privacy Policy';
  const icon = isTerms ? FileText : Shield;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const termsContent = `
CAR RENTAL TERMS AND CONDITIONS

1. RENTAL AGREEMENT
By renting a vehicle from our service, you agree to be bound by these terms and conditions. This agreement constitutes a legally binding contract between you and our company.

2. ELIGIBILITY
- You must be at least 21 years old to rent a vehicle
- You must possess a valid driver's license
- You must provide valid identification and payment method
- International drivers must have an International Driving Permit

3. VEHICLE USE
- The vehicle may only be driven by authorized drivers listed in this agreement
- The vehicle must be used in accordance with all applicable laws and regulations
- Commercial use of the vehicle is strictly prohibited without written consent
- The vehicle must not be used for illegal activities

4. RENTAL PERIOD AND RETURN
- Rental period begins at the time specified in this agreement
- Vehicle must be returned on time to avoid additional charges
- Late returns are subject to additional fees
- Vehicle must be returned in the same condition as received

5. PAYMENT TERMS
- Payment is due at the time of rental
- We accept major credit cards and debit cards
- A security deposit may be required
- Additional charges may apply for damages, late returns, or violations

6. INSURANCE AND LIABILITY
- Basic insurance coverage is included in the rental rate
- You are responsible for any damages not covered by insurance
- You must report any accidents immediately
- Additional insurance options are available for purchase

7. PROHIBITED USES
- Driving under the influence of alcohol or drugs
- Off-road driving or racing
- Towing or carrying excessive weight
- Smoking in the vehicle
- Transporting pets without prior approval

8. CANCELLATION POLICY
- Cancellations made 24 hours before rental start time are fully refundable
- Cancellations made less than 24 hours before rental start time are subject to a 50% cancellation fee
- No-shows are charged the full rental amount

9. DAMAGES AND CHARGES
- You are responsible for all damages to the vehicle
- Damage assessment will be conducted upon vehicle return
- Charges for damages will be applied to your payment method
- Disputes must be reported within 48 hours of vehicle return

10. TERMINATION
We reserve the right to terminate this agreement immediately if you violate any terms or conditions. Upon termination, you must return the vehicle immediately.

11. GOVERNING LAW
This agreement is governed by the laws of the jurisdiction in which the rental occurs.

By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions outlined above.
`;

  const privacyContent = `
PRIVACY POLICY

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, make a reservation, or contact us for support.

Personal Information:
- Name, email address, phone number
- Driver's license information
- Payment information
- Address and contact details

Usage Information:
- Vehicle preferences and rental history
- Website usage and interaction data
- Device information and IP address

2. HOW WE USE YOUR INFORMATION
We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices and support messages
- Respond to your comments and questions
- Monitor and analyze trends and usage
- Personalize your experience

3. INFORMATION SHARING
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
- With service providers who assist us in operating our business
- When required by law or to protect our rights
- In connection with a business transfer or acquisition

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. COOKIES AND TRACKING
We use cookies and similar tracking technologies to enhance your experience and analyze usage patterns.

6. THIRD-PARTY LINKS
Our service may contain links to third-party websites. We are not responsible for the privacy practices of these sites.

7. DATA RETENTION
We retain your personal information for as long as necessary to provide our services and comply with legal obligations.

8. YOUR RIGHTS
You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your personal information
- Object to processing of your information
- Data portability

9. CHILDREN'S PRIVACY
Our service is not intended for children under 13. We do not knowingly collect personal information from children.

10. CHANGES TO THIS POLICY
We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

11. CONTACT US
If you have any questions about this privacy policy, please contact us at privacy@carrental.com.

Last updated: ${new Date().toLocaleDateString()}
`;

  const content = isTerms ? termsContent : privacyContent;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl h-[95vh] sm:h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              {icon === FileText ? (
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              ) : (
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
              )}
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto min-h-0">
            <div className="prose prose-gray max-w-none">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                {content}
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center p-3 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TermsModal;
