import React from 'react'
import Component14 from '../Components/Component14'
import LegalContent, { LegalSection, LegalSubsection, LegalList } from '../Components/LegalContent'

const Legal = () => {
  return (
    <main className="pt-20">
      <Component14
        buttonText="Privacy & Legal"
        titlePart1="Privacy <span>Policy</span>"
        description="We are committed to protecting your privacy and personal information."
      />
      
      <LegalContent 
        title="Privacy Policy"
        lastUpdated="January 16, 2025"
      >
        <LegalSection title="1. Introduction">
          <p className="mb-4">
            FreshFold ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and related services (collectively, the "Service").
          </p>
          <p>
            Please read this Privacy Policy carefully. By using our Service, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our Service.
          </p>
        </LegalSection>

        <LegalSection title="2. Information We Collect">
          <LegalSubsection title="2.1 Information You Provide">
            <p className="mb-4">
              We collect information that you voluntarily provide to us when you:
            </p>
            <LegalList items={[
              "Create an account (name, email address, phone number, password)",
              "Complete your profile (address, payment information, preferences)",
              "Book a service (service details, pickup/delivery addresses, special instructions)",
              "Contact our support team (correspondence and support requests)",
              "Submit reviews or feedback",
              "Register as a service provider (business information, licenses, certifications)"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="2.2 Automatically Collected Information">
            <p className="mb-4">
              When you use our Service, we automatically collect certain information, including:
            </p>
            <LegalList items={[
              "Device information (device type, operating system, browser type)",
              "IP address and location data",
              "Usage data (pages visited, features used, time spent)",
              "Cookies and similar tracking technologies",
              "Transaction history and payment information",
              "Communication preferences"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="2.3 Information from Third Parties">
            <p>
              We may receive information about you from third-party services, such as payment processors, social media platforms (if you connect your account), and service providers who help us verify your identity or process transactions.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="3. How We Use Your Information">
          <p className="mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <LegalList items={[
            "To provide, maintain, and improve our Service",
            "To process transactions and send related information",
            "To communicate with you about your account, services, and updates",
            "To match you with appropriate service providers",
            "To verify provider credentials and ensure service quality",
            "To send marketing communications (with your consent)",
            "To detect, prevent, and address technical issues and fraud",
            "To comply with legal obligations and enforce our Terms of Service",
            "To personalize your experience and provide customer support",
            "To analyze usage patterns and improve our Service"
          ]} />
        </LegalSection>

        <LegalSection title="4. How We Share Your Information">
          <LegalSubsection title="4.1 With Service Providers">
            <p>
              When you book a service, we share necessary information with the selected provider, including your name, contact information, service details, and delivery address, to enable them to complete the service.
            </p>
          </LegalSubsection>

          <LegalSubsection title="4.2 With Service Partners">
            <p className="mb-4">
              We may share your information with trusted third-party service providers who assist us in:
            </p>
            <LegalList items={[
              "Payment processing",
              "Email and SMS delivery",
              "Customer support",
              "Analytics and data analysis",
              "Marketing and advertising (with your consent)",
              "Fraud prevention and security"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="4.3 Legal Requirements">
            <p>
              We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>
          </LegalSubsection>

          <LegalSubsection title="4.4 Business Transfers">
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity, subject to the same privacy protections.
            </p>
          </LegalSubsection>

          <LegalSubsection title="4.5 With Your Consent">
            <p>
              We may share your information with third parties when you explicitly consent to such sharing.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="5. Data Security">
          <p className="mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information, including:
          </p>
          <LegalList items={[
            "SSL/TLS encryption for data transmission",
            "Secure storage of sensitive information",
            "Regular security assessments and updates",
            "Access controls and authentication measures",
            "Employee training on data protection"
          ]} />
          <p className="mt-4">
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
          </p>
        </LegalSection>

        <LegalSection title="6. Your Privacy Rights">
          <LegalSubsection title="6.1 Access and Correction">
            <p>
              You have the right to access, update, and correct your personal information at any time through your account settings or by contacting us.
            </p>
          </LegalSubsection>

          <LegalSubsection title="6.2 Data Deletion">
            <p>
              You may request deletion of your account and personal information. We will honor such requests subject to our legal obligations to retain certain information for record-keeping, legal compliance, and dispute resolution purposes.
            </p>
          </LegalSubsection>

          <LegalSubsection title="6.3 Opt-Out Rights">
            <p className="mb-4">
              You can opt out of:
            </p>
            <LegalList items={[
              "Marketing emails by clicking the unsubscribe link",
              "SMS notifications through your account settings",
              "Location tracking through your device settings",
              "Cookies through your browser settings (may affect Service functionality)"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="6.4 Data Portability">
            <p>
              You have the right to receive a copy of your personal data in a structured, commonly used format. Contact us to request your data export.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="7. Cookies and Tracking Technologies">
          <LegalSubsection title="7.1 Types of Cookies">
            <p className="mb-4">
              We use various types of cookies:
            </p>
            <LegalList items={[
              "Essential cookies: Required for the Service to function",
              "Performance cookies: Help us understand how visitors use our Service",
              "Functionality cookies: Remember your preferences and settings",
              "Advertising cookies: Used to deliver relevant advertisements (with consent)"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="7.2 Managing Cookies">
            <p>
              You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our Service. For more information, see our Cookie Policy.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="8. Children's Privacy">
          <p>
            Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will take steps to delete such information promptly.
          </p>
        </LegalSection>

        <LegalSection title="9. International Data Transfers">
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate safeguards to ensure your information receives adequate protection.
          </p>
        </LegalSection>

        <LegalSection title="10. Data Retention">
          <p>
            We retain your personal information for as long as necessary to provide our Service, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.
          </p>
        </LegalSection>

        <LegalSection title="11. California Privacy Rights">
          <p className="mb-4">
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
          </p>
          <LegalList items={[
            "Right to know what personal information is collected",
            "Right to know if personal information is sold or disclosed",
            "Right to opt-out of the sale of personal information",
            "Right to non-discrimination for exercising your privacy rights"
          ]} />
          <p className="mt-4">
            We do not sell your personal information to third parties.
          </p>
        </LegalSection>

        <LegalSection title="12. GDPR Rights (EU Residents)">
          <p className="mb-4">
            If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
          </p>
          <LegalList items={[
            "Right to access your personal data",
            "Right to rectification of inaccurate data",
            "Right to erasure ('right to be forgotten')",
            "Right to restrict processing",
            "Right to data portability",
            "Right to object to processing",
            "Right to withdraw consent at any time"
          ]} />
        </LegalSection>

        <LegalSection title="13. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
          </p>
        </LegalSection>

        <LegalSection title="14. Contact Us">
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> privacy@freshfold.com<br />
            <strong>Address:</strong> 123 Market Street, San Francisco, CA 94102<br />
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
          <p className="mt-4">
            <strong>Data Protection Officer:</strong> dpo@freshfold.com
          </p>
        </LegalSection>
      </LegalContent>
    </main>
  )
}

export default Legal
