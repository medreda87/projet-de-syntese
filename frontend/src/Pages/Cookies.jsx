import React from 'react'
import Component14 from '../Components/Component14'
import LegalContent, { LegalSection, LegalSubsection, LegalList } from '../Components/LegalContent'

const Cookies = () => {
  return (
    <main className="pt-20">
      <Component14
        buttonText="Cookie Information"
        titlePart1="Cookie <span>Policy</span>"
        description="Learn how we use cookies and similar technologies to enhance your experience."
      />
      
      <LegalContent 
        title="Cookie Policy"
        lastUpdated="January 16, 2025"
      >
        <LegalSection title="1. What Are Cookies?">
          <p className="mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p>
            Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you browse our website and allows us to improve our Service.
          </p>
        </LegalSection>

        <LegalSection title="2. How We Use Cookies">
          <p className="mb-4">
            Mesbanati uses cookies and similar tracking technologies to:
          </p>
          <LegalList items={[
            "Remember your preferences and settings",
            "Keep you logged in to your account",
            "Understand how you use our Service",
            "Improve and personalize your experience",
            "Analyze website traffic and usage patterns",
            "Deliver relevant advertisements (with your consent)",
            "Ensure security and prevent fraud"
          ]} />
        </LegalSection>

        <LegalSection title="3. Types of Cookies We Use">
          <LegalSubsection title="3.1 Essential Cookies">
            <p className="mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as:
            </p>
            <LegalList items={[
              "User authentication and login",
              "Shopping cart and checkout process",
              "Security and fraud prevention",
              "Load balancing and site performance"
            ]} />
            <p className="mt-4">
              <strong>Duration:</strong> Session cookies (deleted when you close your browser) and persistent cookies (remain until expiration or deletion)
            </p>
            <p className="mt-2">
              <strong>Can you opt out?</strong> No, these cookies are essential for the Service to work.
            </p>
          </LegalSubsection>

          <LegalSubsection title="3.2 Performance and Analytics Cookies">
            <p className="mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us:
            </p>
            <LegalList items={[
              "Count visitors and track page views",
              "Understand which pages are most popular",
              "Identify errors and technical issues",
              "Measure website performance and speed"
            ]} />
            <p className="mt-4">
              <strong>Examples:</strong> Google Analytics cookies
            </p>
            <p className="mt-2">
              <strong>Can you opt out?</strong> Yes, you can disable these through your browser settings or our cookie preferences.
            </p>
          </LegalSubsection>

          <LegalSubsection title="3.3 Functionality Cookies">
            <p className="mb-4">
              These cookies allow the website to remember choices you make and provide enhanced, personalized features:
            </p>
            <LegalList items={[
              "Language preferences",
              "Location settings",
              "Display preferences (theme, font size)",
              "Previously viewed items",
              "Saved searches and filters"
            ]} />
            <p className="mt-4">
              <strong>Can you opt out?</strong> Yes, but disabling these may affect website functionality.
            </p>
          </LegalSubsection>

          <LegalSubsection title="3.4 Advertising and Marketing Cookies">
            <p className="mb-4">
              These cookies are used to deliver advertisements that are relevant to you and your interests. They also help measure the effectiveness of advertising campaigns:
            </p>
            <LegalList items={[
              "Track your browsing habits across websites",
              "Build a profile of your interests",
              "Show you relevant advertisements",
              "Limit the number of times you see an ad",
              "Measure advertising campaign effectiveness"
            ]} />
            <p className="mt-4">
              <strong>Examples:</strong> Facebook Pixel, Google Ads cookies
            </p>
            <p className="mt-2">
              <strong>Can you opt out?</strong> Yes, you can opt out through our cookie preferences or your browser settings.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="4. Third-Party Cookies">
          <p className="mb-4">
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver advertisements. These include:
          </p>
          <LegalList items={[
            "Google Analytics: Website analytics and performance tracking",
            "Google Ads: Advertising and remarketing",
            "Facebook Pixel: Social media advertising and analytics",
            "Payment processors: Secure payment processing",
            "Customer support tools: Live chat and support functionality"
          ]} />
          <p className="mt-4">
            These third parties may use cookies to collect information about your online activities across different websites. We do not control these third-party cookies, and this Cookie Policy does not cover their use.
          </p>
        </LegalSection>

        <LegalSection title="5. Cookie Duration">
          <LegalSubsection title="5.1 Session Cookies">
            <p>
              Session cookies are temporary and are deleted when you close your browser. They are used to maintain your session while you navigate our website.
            </p>
          </LegalSubsection>

          <LegalSubsection title="5.2 Persistent Cookies">
            <p>
              Persistent cookies remain on your device for a set period or until you delete them. They help us recognize you when you return to our website and remember your preferences.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="6. Managing Your Cookie Preferences">
          <LegalSubsection title="6.1 Cookie Consent Banner">
            <p>
              When you first visit our website, you'll see a cookie consent banner. You can choose which types of cookies to accept or reject. You can change these preferences at any time through our cookie settings.
            </p>
          </LegalSubsection>

          <LegalSubsection title="6.2 Browser Settings">
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <LegalList items={[
              "View what cookies are stored on your device",
              "Delete existing cookies",
              "Block cookies from specific websites",
              "Block all cookies",
              "Set your browser to notify you when cookies are set"
            ]} />
            <p className="mt-4">
              <strong>Note:</strong> Blocking or deleting cookies may impact your ability to use certain features of our Service.
            </p>
          </LegalSubsection>

          <LegalSubsection title="6.3 Browser-Specific Instructions">
            <p className="mb-4">
              Here are links to help you manage cookies in popular browsers:
            </p>
            <LegalList items={[
              "Google Chrome: Settings > Privacy and Security > Cookies",
              "Mozilla Firefox: Options > Privacy & Security > Cookies and Site Data",
              "Safari: Preferences > Privacy > Cookies and website data",
              "Microsoft Edge: Settings > Privacy, search, and services > Cookies",
              "Opera: Settings > Privacy & Security > Cookies"
            ]} />
          </LegalSubsection>

          <LegalSubsection title="6.4 Mobile Device Settings">
            <p>
              On mobile devices, you can manage cookies through your browser app settings. Additionally, you can control location tracking and advertising preferences through your device's privacy settings.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="7. Other Tracking Technologies">
          <LegalSubsection title="7.1 Web Beacons and Pixels">
            <p>
              We may use web beacons (also known as pixel tags or clear GIFs) in emails and on our website. These are small graphic images that help us track email open rates and website usage.
            </p>
          </LegalSubsection>

          <LegalSubsection title="7.2 Local Storage">
            <p>
              We may use HTML5 local storage to store information on your device. This is similar to cookies but can store larger amounts of data. You can clear local storage through your browser settings.
            </p>
          </LegalSubsection>

          <LegalSubsection title="7.3 Device Fingerprinting">
            <p>
              We may use device fingerprinting technologies to identify your device based on its unique characteristics. This helps us prevent fraud and ensure security.
            </p>
          </LegalSubsection>
        </LegalSection>

        <LegalSection title="8. Do Not Track Signals">
          <p>
            Some browsers include a "Do Not Track" (DNT) feature that signals websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. We do not currently respond to DNT browser signals or mechanisms.
          </p>
        </LegalSection>

        <LegalSection title="9. Cookies and Personal Data">
          <p>
            Some cookies may collect personal data. When this is the case, our use of such cookies is also governed by our Privacy Policy. We process personal data collected through cookies in accordance with applicable data protection laws, including GDPR and CCPA.
          </p>
        </LegalSection>

        <LegalSection title="10. Updates to This Cookie Policy">
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date.
          </p>
        </LegalSection>

        <LegalSection title="11. Contact Us">
          <p>
            If you have questions about our use of cookies or this Cookie Policy, please contact us:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> privacy@mesbanati.ma<br />
            <strong>Address:</strong> 123 Market Street, San Francisco, CA 94102<br />
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
        </LegalSection>
      </LegalContent>
    </main>
  )
}

export default Cookies
