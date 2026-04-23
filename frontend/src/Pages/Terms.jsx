import React from 'react'
import Component14 from '../Components/Component14'
import LegalContent, { LegalSection, LegalSubsection, LegalList } from '../Components/LegalContent'

const Terms = () => {
  return (
    <main className="pt-20">
      <Component14
        buttonText="Legal Information"
        titlePart1="Terms of <span>Service</span>"
        description="Please read these terms carefully before using Mesbanati's services."
      />
      
      <LegalContent 
        title="Terms of Service"
        lastUpdated="January 16, 2025"
      >
        <LegalSection title="1. Acceptance of Terms">
          <p className="mb-4">
            By accessing and using Mesbanati ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
          <p>
            Mesbanati reserves the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.
          </p>
        </LegalSection>

        <LegalSection title="2. Description of Service">
          <p className="mb-4">
            Mesbanati is an online marketplace platform that connects customers seeking laundry services with independent service providers. We facilitate transactions between customers and providers but are not a party to the actual service agreement between them.
          </p>
          <p>
            We provide a platform for:
          </p>
          <LegalList items={[
            "Browsing and discovering local laundry service providers",
            "Booking laundry services including wash & fold, dry cleaning, and ironing",
            "Processing payments between customers and providers",
            "Facilitating communication between customers and providers",
            "Managing order tracking and delivery coordination"
          ]} />
        </LegalSection>

        <LegalSection title="3. User Accounts">
          <LegalSubsection title="3.1 Account Creation">
            <p className="mb-4">
              To use certain features of our Service, you must register for an account. You agree to:
            </p>
            <LegalList items={[
              "Provide accurate, current, and complete information during registration",
              "Maintain and update your account information to keep it accurate",
              "Maintain the security of your password and identification",
              "Accept all responsibility for activities that occur under your account",
              "Notify us immediately of any unauthorized use of your account"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="3.2 Account Eligibility">
            <p>
              You must be at least 18 years old to create an account and use our Service. By creating an account, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="4. Service Provider Terms">
          <LegalSubsection title="4.1 Provider Responsibilities">
            <p className="mb-4">
              If you register as a service provider, you agree to:
            </p>
            <LegalList items={[
              "Provide accurate information about your services, pricing, and availability",
              "Maintain appropriate licenses and insurance as required by law",
              "Deliver services in a professional and timely manner",
              "Comply with all applicable local, state, and federal laws",
              "Respond promptly to customer inquiries and service requests",
              "Maintain the quality standards advertised on your profile"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="4.2 Provider Fees">
            <p>
              Mesbanati charges a commission fee on completed transactions. The current commission rate is displayed in your provider dashboard. Fees are deducted from payments before they are transferred to your account. We reserve the right to modify commission rates with 30 days' notice.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="5. Customer Terms">
          <LegalSubsection title="5.1 Service Booking">
            <p className="mb-4">
              When you book a service through Mesbanati:
            </p>
            <LegalList items={[
              "You enter into a service agreement directly with the provider",
              "You agree to pay the total amount displayed at checkout",
              "You are responsible for accurately describing your laundry needs",
              "You must be available at the scheduled pickup time or arrange for someone to be present"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="5.2 Payment">
            <p>
              All payments are processed securely through our platform. By booking a service, you authorize us to charge your payment method for the total amount, including service fees and applicable taxes. Payments are held securely until service completion.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="6. Cancellation and Refund Policy">
          <LegalSubsection title="6.1 Cancellation by Customer">
            <p className="mb-4">
              Customers may cancel bookings subject to the following:
            </p>
            <LegalList items={[
              "Cancellations made 24+ hours before scheduled pickup: Full refund",
              "Cancellations made less than 24 hours before pickup: Provider's cancellation policy applies",
              "No-show or refusal at pickup: No refund"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="6.2 Cancellation by Provider">
            <p>
              If a provider cancels your booking, you will receive a full refund and we will help you find an alternative provider if desired.
            </p>
          </LegalSubsection>

          <LegalSubsection title="6.3 Service Issues">
            <p>
              If you are not satisfied with the service quality, please contact our support team within 48 hours of delivery. We will work with you and the provider to resolve the issue, which may include a partial or full refund at our discretion.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="7. Prohibited Activities">
          <p className="mb-4">
            You agree not to:
          </p>
          <LegalList items={[
            "Use the Service for any illegal purpose or in violation of any laws",
            "Post false, misleading, or fraudulent information",
            "Harass, abuse, or harm other users",
            "Interfere with or disrupt the Service or servers",
            "Attempt to gain unauthorized access to any portion of the Service",
            "Use automated systems to access the Service without permission",
            "Impersonate any person or entity",
            "Collect or store personal data about other users without permission",
            "Use the Service to compete with Mesbanati or solicit providers to use competing services"
          ]} />
        </LegalSection>

        <LegalSection title="8. Intellectual Property">
          <p className="mb-4">
            The Service and its original content, features, and functionality are owned by Mesbanati and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any content from our Service without our express written permission.
          </p>
        </LegalSection>

        <LegalSection title="9. Limitation of Liability">
          <p className="mb-4">
            Mesbanati acts as an intermediary platform connecting customers and providers. We are not responsible for:
          </p>
          <LegalList items={[
            "The quality, safety, or legality of services provided by third-party providers",
            "The accuracy of provider listings or descriptions",
            "The ability of providers to complete services",
            "The actions or omissions of users",
            "Any disputes between customers and providers"
          ]} />
          <p className="mt-4">
            To the maximum extent permitted by law, Mesbanati shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
          </p>
        </LegalSection>

        <LegalSection title="10. Indemnification">
          <p>
            You agree to indemnify and hold Mesbanati harmless from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the Service, violation of these Terms, or infringement of any rights of another party.
          </p>
        </LegalSection>

        <LegalSection title="11. Termination">
          <p className="mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will cease immediately. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
          </p>
        </LegalSection>

        <LegalSection title="12. Dispute Resolution">
          <LegalSubsection title="12.1 Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Mesbanati operates, without regard to its conflict of law provisions.
            </p>
          </LegalSubsection>

          <LegalSubsection title="12.2 Dispute Process">
            <p className="mb-4">
              In the event of any dispute arising from these Terms or your use of the Service:
            </p>
            <LegalList items={[
              "First, contact our support team to attempt to resolve the dispute",
              "If unresolved, disputes will be resolved through binding arbitration",
              "You waive any right to participate in a class-action lawsuit or class-wide arbitration"
            ]} />
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="13. General Provisions">
          <LegalSubsection title="13.1 Entire Agreement">
            <p>
              These Terms constitute the entire agreement between you and Mesbanati regarding the use of the Service and supersede all prior agreements and understandings.
            </p>
          </LegalSubsection>

          <LegalSubsection title="13.2 Severability">
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </LegalSubsection>

          <LegalSubsection title="13.3 Contact Information">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@mesbanati.ma<br />
              <strong>Address:</strong> 123 Market Street, San Francisco, CA 94102
            </p>
          </LegalSubsection>
        </LegalSection>
      </LegalContent>
    </main>
  )
}

export default Terms
