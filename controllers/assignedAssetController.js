import AssignedAsset from "../models/AssignedAsset.js";


export const getMyAssets = async (req, res) => {
  try {
    const { search, type, page = 1, limit = 5 } = req.query;

    const filter = { employeeEmail: req.user.email };

    if (search) {
      filter.assetName = { $regex: search, $options: "i" };
    }

    if (type) {
      filter.assetType = type;
    }

    const skip = (page - 1) * limit;

    // Count total documents for pagination
    const totalItems = await AssignedAsset.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch paginated data
    const assets = await AssignedAsset.find(filter)
      .sort({ assignmentDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      assets,
      totalPages,
      totalItems,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
