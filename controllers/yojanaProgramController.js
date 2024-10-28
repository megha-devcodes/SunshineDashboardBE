exports.getYojnaOptions = (req, res) => {
    const yojnaOptions = [
      {
        name: "SHIKSHIT BEROJGAR PANJIKARAN PARIYOJNA",
        jobTypes: [
          { type: "DIVISIONAL INCHARGE", fee: 5000 },
          { type: "DISTRICT INCHARGE", fee: 2000 },
          { type: "BLOCK INCHARGE", fee: 1000 },
        ],
      },
      {
        name: "MAHILA SVAASTHY SURAKSHA YOJANA",
        jobTypes: [
          { type: "DIVISIONAL INCHARGE", fee: 5000 },
          { type: "DISTRICT INCHARGE", fee: 2000 },
          { type: "BLOCK INCHARGE", fee: 1000 },
        ],
      },
      {
        name: "FREE SEWING MACHINE DISTRIBUTION PARIYOJNA",
        jobTypes: [
          { type: "DIVISIONAL INCHARGE", fee: 5000 },
          { type: "DISTRICT INCHARGE", fee: 2000 },
          { type: "BLOCK INCHARGE", fee: 1000 },
        ],
      },
    ];
  
    res.status(200).json(yojnaOptions);
  };
  