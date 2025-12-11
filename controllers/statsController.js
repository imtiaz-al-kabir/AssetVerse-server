import Asset from "../models/Asset.js";
import Request from "../models/Request.js";


export const getHrStats = async (req, res) => {
  try {
    const hrEmail = req.user.email;

  
    const returnableCount = await Asset.countDocuments({
      hrEmail,
      productType: "Returnable",
    });
    const nonReturnableCount = await Asset.countDocuments({
      hrEmail,
      productType: "Non-returnable",
    });

    const pieData = [
      { name: "Returnable", value: returnableCount },
      { name: "Non-returnable", value: nonReturnableCount },
    ];

    const topRequests = await Request.aggregate([
      { $match: { hrEmail: hrEmail } },
      { $group: { _id: "$assetName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const barData = topRequests.map((item) => ({
      name: item._id,
      requests: item.count,
    }));

    res.json({ pieData, barData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
