const getCsvHeaders = (type) => {
  let csvHeaders;

  switch (type) {
    case "summary":
      csvHeaders = [
        { label: "id", key: "dbRowId" },
        { label: "Date", key: "order_created_at" },
        { label: "Order #", key: "order" },
        { label: "Title", key: "product_title" },
        { label: "Artist", key: "artist" },
        { label: "Product", key: "product_type" },
        { label: "Commissions Amount", key: "commissions_amount" },
        { label: "Paid or Unpaid", key: "is_commissions_paid" },
        { label: "Paypal Email", key: "paypal_email" },
        { label: "Is International", key: "is_international" },
      ];
      break;

    case "byArtist":
      csvHeaders = [
        { label: "Artist", key: "artist" },
        { label: "Product", key: "product" },
        { label: "Product Type", key: "productType" },
        { label: "Quantity", key: "quantity" },
        { label: "Paid Amount", key: "paidAmount" },
        { label: "Unpaid Amount", key: "unpaidAmount" },
      ];
      break;
    default:
      return;
  }
  return csvHeaders;
};

export default getCsvHeaders;