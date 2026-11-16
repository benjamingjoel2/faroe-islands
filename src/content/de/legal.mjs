// Legal pages. Placeholders in {braces} are filled from src/config.mjs at build time:
// {brand}, {email}, {address}, {site}, {updated}
export default {
  updated: '16 November 2026',
  updatedLabel: 'Last updated: {updated}',

  privacy: {
    title: 'Privacy Policy',
    description: 'How {brand} collects, uses and protects personal data from this website and from enquiries.',
    intro: 'This policy explains what personal data {brand} collects when you use {site} or send us an enquiry, why we collect it, and the rights you have.',
    sections: [
      { h: 'Who we are', p: ['{brand} is the data controller for the personal data described in this policy.', 'Postal address: {address}.', 'Email: [{email}](mailto:{email}). Write to us about anything in this policy.'] },
      { h: 'What we collect', p: ['When you send the enquiry form or email us, we receive:', ['your name and email address;', 'your travel dates, number of travellers, interests and the islands you mention;', 'anything else you choose to write in your message.'], 'When you visit the website, our hosting provider automatically processes technical data such as your IP address, browser type and the pages requested. This is needed to deliver the site and keep it secure.', 'We do not use analytics, advertising trackers or social media plug-ins, and we do not create profiles of visitors.'] },
      { h: 'Why we use it, and on what basis', p: [['To reply to your enquiry and plan your trip: steps taken at your request before entering into a contract, and then to perform that contract.', 'To make bookings with ferries, guides, landowners and accommodation on your behalf: performance of our contract with you.', 'To keep records required by accounting and tax law: legal obligation.', 'To run the website securely: our legitimate interest in a working, safe site.'], 'We only ask for the information we need. Please don’t send us health information unless it matters for your trip, for example a mobility need. If you do, we use it only to plan around it, with your consent.'] },
      { h: 'Who we share it with', p: ['We share personal data only where it is needed:', ['Website hosting: Vercel Inc. hosts this website and processes technical request data.', 'Enquiry form delivery: FormSubmit (formsubmit.co) forwards the form to our email inbox.', 'Suppliers on your trip: when you book, we pass the names and details needed to ferry and boat operators, the helicopter operator, guides, landowners and accommodation providers.', 'Advisers and authorities: where the law requires it.'], 'We do not sell personal data, and we do not share it for marketing.'] },
      { h: 'Transfers outside the Faroe Islands', p: ['Some of our service providers, including our hosting and form providers, are based in or use servers in other countries, including the United States. Where personal data is transferred, we rely on appropriate safeguards such as standard contractual clauses or an adequacy decision.'] },
      { h: 'How long we keep it', p: ['Enquiries that don’t lead to a booking are deleted within 24 months of our last contact. Booking records are kept for as long as accounting and tax law requires, usually five years after the end of the financial year. Server logs held by our host are kept for a short period, normally a matter of days.'] },
      { h: 'Your rights', p: ['You have the right to:', ['access the personal data we hold about you;', 'have inaccurate data corrected;', 'have your data deleted where we no longer need it;', 'restrict or object to certain processing;', 'receive your data in a portable format;', 'withdraw consent at any time, where we rely on consent.'], 'To use any of these rights, email [{email}](mailto:{email}). We reply within one month.'] },
      { h: 'Complaints', p: ['If you think we have handled your data wrongly, please tell us first so we can put it right. You can also complain to the Faroese Data Protection Authority (Dátueftirlitið), or to the data protection authority where you live.'] },
      { h: 'Security', p: ['The website is served over an encrypted connection (HTTPS). We keep enquiries in access-controlled email and documents, and we share them only with the suppliers your trip needs.'] },
      { h: 'Changes to this policy', p: ['We update this policy when our practices change. The date at the bottom shows the latest version.'] },
    ],
  },

  terms: {
    title: 'Booking Terms',
    description: 'The terms that apply when you plan and book a Faroe Islands trip with {brand}.',
    intro: 'These terms apply when you book a trip with {brand}. Please read them together with the written quote we send you, which sets out the specific services, prices, deposit and payment dates for your trip.',
    sections: [
      { h: 'Who you are contracting with', p: ['Your contract is with {brand}, {address}. Email: [{email}](mailto:{email}).'] },
      { h: 'What we provide', p: ['We plan independent trips to the Faroe Islands. Depending on your quote, our service may include route planning, booking accommodation, ferries, boats, guides and landowner access on your behalf, and support during your trip.', 'Ferries, passenger boats, the helicopter, guides, landowners and accommodation are run by independent suppliers. Their own terms and conditions also apply to the services they provide.'] },
      { h: 'Quotes and prices', p: ['All prices are given in your written quote and are shown as “From” prices until your services are confirmed. Prices depend on dates, availability and supplier fares, which can change before booking. Once we confirm your booking in writing, the price of the confirmed services is fixed, except where these terms or the law allow a change.', 'Public fees outside our control, such as tunnel tolls, the visitor sustainability fee and landowner fees paid on the day, are not included unless your quote says so.'] },
      { h: 'Making a booking', p: ['A booking is confirmed when you have accepted our written quote and we have received the deposit it states. We then send a written confirmation. Please check it carefully and tell us about any mistakes straight away.'] },
      { h: 'Payment', p: ['The balance is due by the date in your quote. If it isn’t paid on time, we may treat the booking as cancelled by you, and the cancellation charges below apply.'] },
      { h: 'If you change or cancel', p: ['Ask for changes in writing. We will try to help, but changes depend on availability, and suppliers may charge for them.', 'If you cancel, you must tell us in writing. The cancellation charges set out in your quote apply, plus any non-refundable costs from suppliers, such as ferry tickets with no refund. The closer to departure you cancel, the higher the charge.'] },
      { h: 'Weather, cancelled sailings and spare days', p: ['The Faroe Islands’ weather regularly causes ferries, boats, the helicopter and guided walks to be cancelled or changed. We plan spare days to reduce the effect of this, and we will rearrange your days where we can.', 'A cancellation by a supplier because of weather is not a failure by us. Where a supplier refunds a cancelled service, we pass the refund to you. We cannot refund services that suppliers do not refund. For example, a helicopter fare is not refunded if the boat back is cancelled.', 'If weather forces a major change, we will offer you the best alternative available.'] },
      { h: 'If we change or cancel', p: ['Occasionally we may need to change a confirmed arrangement. We will tell you as soon as possible. If the change is significant, you may accept it, accept an alternative, or cancel and receive a refund of the money you have paid us for the affected services.', 'We will not cancel your trip less than eight weeks before departure except for reasons outside our control, or if you have not paid.'] },
      { h: 'Your responsibilities', p: [['Hold a valid passport or ID card and any visa you need. The Faroe Islands are outside the EU and Schengen, and a Schengen or Danish visa is not valid for the Faroes.', 'Take out travel insurance that covers cancellation, medical costs and rescue, valid in the Faroe Islands.', 'Make sure the walks you choose suit your fitness and experience.', 'Follow local rules: landowner fees, compulsory guides, closing gates, no dogs in the outfield, and keeping away from sheep and nesting birds.', 'Follow the instructions of guides, crews and the people we work with, especially about weather and safety.']] },
      { h: 'Package travel', p: ['Where the services we sell you form a package or a linked travel arrangement under the applicable package travel rules, you have the protections those rules give, and we will tell you in writing before you book.'] },
      { h: 'Our liability', p: ['We are responsible for providing the services we have confirmed with reasonable skill and care. We are not responsible for failures caused by you, by third parties unconnected with your services, or by unusual and unavoidable circumstances, including severe weather.', 'Nothing in these terms limits our liability for death or personal injury caused by our negligence, or any liability that cannot be limited by law.'] },
      { h: 'Complaints', p: ['If something goes wrong during your trip, tell us straight away so we can try to fix it. If you are still not satisfied, write to us at [{email}](mailto:{email}) within 28 days of your return.'] },
      { h: 'Law and jurisdiction', p: ['These terms are governed by Faroese law, and disputes are subject to the courts of the Faroe Islands. If you are a consumer living elsewhere, you also keep any mandatory protections that the law of your own country gives you.'] },
    ],
  },

  cookies: {
    title: 'Cookie Policy',
    description: 'How {brand} uses cookies and similar technologies on {site}: we don’t use tracking cookies.',
    intro: 'This page explains how {site} uses cookies and similar technologies. In short: we don’t set any cookies, and we don’t track you.',
    sections: [
      { h: 'What cookies are', p: ['Cookies are small text files that a website stores in your browser. Similar technologies include local storage and tracking pixels. They can be used to make a site work, to remember your choices, or to track you across sites.'] },
      { h: 'Cookies on this website', p: ['{brand} does not set any cookies on {site}. We do not use analytics, advertising, social media or tracking cookies, and we don’t use local storage to identify you. That is why you don’t see a cookie banner.', 'Our fonts and images are served from our own website, not from third-party services.'] },
      { h: 'The planning tools', p: ['The weather-window planner and the transport planner run entirely in your browser. Your chosen dates and places are added to the page address so you can bookmark or share them. They are not stored or sent to us.'] },
      { h: 'The enquiry form', p: ['When you send the enquiry form, your details go to our form provider, FormSubmit, which forwards them to us by email. If your browser has JavaScript turned off, the form opens a FormSubmit page, which may set its own cookies under its own policy.'] },
      { h: 'Links to other websites', p: ['We link to other websites, such as ferry, tunnel and weather services. They have their own cookie policies, which apply when you visit them.'] },
      { h: 'Managing cookies', p: ['You can block or delete cookies in your browser settings at any time. Blocking cookies won’t affect how this website works.'] },
      { h: 'Contact', p: ['Questions about this policy: [{email}](mailto:{email}), {address}.'] },
    ],
  },

  credits: {
    title: 'Photo credits',
    description: 'Credits for the Creative Commons photographs used on this website.',
    intro: 'Photographs used under Creative Commons licences are credited below, with links to the original files and licences. Click a title to see the source.',
    cols: { photo: 'Photo', place: 'Place', author: 'Photographer', licence: 'Licence' },
    note: 'Photos may be cropped and resized for this website. If you are a photographer and something here is wrong, write to us and we will correct it.',
  },
};
