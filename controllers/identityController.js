exports.getIdentityTypes = (req, res) => {
  const identityTypes = [
    { value: "Aadhar Card", label_en: "Aadhar Card", label_hi: "आधार कार्ड" },
    {
      value: "Community Proof",
      label_en: "Community Proof",
      label_hi: "सामुदायिक प्रमाण पत्र",
    },
    { value: "Rasan Card", label_en: "Ration Card", label_hi: "राशन कार्ड" },
    {
      value: "Income Certificate",
      label_en: "Income Certificate",
      label_hi: "आय प्रमाण पत्र",
    },
    {
      value: "Handicapped Certificate",
      label_en: "Handicapped Certificate",
      label_hi: "विकलांग प्रमाण पत्र",
    },
    {
      value: "Destitute widow Certificate",
      label_en: "Destitute Widow Certificate",
      label_hi: "निराश्रित विधवा प्रमाण पत्र",
    },
  ];

  res.status(200).json(identityTypes);
};
