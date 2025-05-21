import React from "react";

const WhatsAppButton = () => {
  const phoneNumber = "+923178871763";
  const message = "Hello, I need help with your product!";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-5 rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transform hover:scale-110 transition-all duration-300"
    >
      <i className="fab fa-whatsapp text-3xl"></i>
    </a>
  );
};

export default WhatsAppButton;
