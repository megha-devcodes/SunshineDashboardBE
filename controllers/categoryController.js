exports.getCategoryTypes = (req, res) => {
    const categoryTypes = [
      { value: "General", label_en: "General", label_hi: "सामान्य" },
      { value: "OBC", label_en: "OBC", label_hi: "अन्य पिछड़ा वर्ग" },
      { value: "SC", label_en: "SC", label_hi: "अनुसूचित जाति" },
      { value: "ST", label_en: "ST", label_hi: "अनुसूचित जनजाति" },
    ];
  
    res.status(200).json(categoryTypes);
  };
  