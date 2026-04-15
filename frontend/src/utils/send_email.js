import emailjs from "emailjs-com";

// Generate email HTML template according to the provided format
const generateEmailTemplate = (name, message, time , phone) => {
  const currentTime = time || new Date().toLocaleString();
  
  return `<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
  <div>A message by ${name} has been received. Kindly respond at your earliest convenience.</div>
  <div
    style="
      margin-top: 20px;
      padding: 15px 0;
      border-width: 1px 0;
      border-style: dashed;
      border-color: lightgrey;
    "
  >
    <table role="presentation">
      <tr>
        <td style="vertical-align: top">
          <div
            style="
              padding: 6px 10px;
              margin: 0 10px;
              background-color: aliceblue;
              border-radius: 5px;
              font-size: 26px;
            "
            role="img"
          >
            👤
          </div>
        </td>
        <td style="vertical-align: top">
          
          <div style="color: #2c3e50; font-size: 16px">
            <strong>From : ${name}</strong>
          </div>
          <div style="color: #cccccc; font-size: 13px">${currentTime}</div>
          <p style="font-size: 16px">${message}<br><br>
          Whatasp : <a href=${`https://wa.me/${phone}`}>Whatapp</a></p>
        </td>
      </tr>
    </table>
  </div>
</div>`;
};

export const sendEmail = (props) => {
  const { name, phone, email, address, subject, message } = props;
  
  // Generate the email HTML template
  const emailHtml = generateEmailTemplate(
    name || 'Unknown',
    message || `Business: ${props.businessName || 'N/A'}\nPhone: ${phone || 'N/A'}\nEmail: ${email || 'N/A'}\nAddress: ${address || 'N/A'}
       
    `,
    new Date().toLocaleString(),
    phone
  );

  return emailjs.send(
    "service_da54p3l",     // Service ID
    "template_dlr8gz6",    // Template ID
    {
      name: name || 'Unknown',
      phone: phone || '',
      email: email || '',
      address: address || '',
      subject: subject || 'New Application',
      message: message || emailHtml,
      html_message: emailHtml  // Add HTML version
    },
    "uM2iqvzCE2eGYXlPP"        // Public Key
  );
};

 