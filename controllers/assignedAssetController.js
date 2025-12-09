import AssignedAsset from "../models/AssignedAsset.js";

// @desc    Get current user's assigned assets
// @route   GET /api/assigned-assets
// @access  Private
export const getMyAssets = async (req, res) => {
  try {
    const { search, type } = req.query;
    let filter = { employeeEmail: req.user.email };

    if (search) {
      filter.assetName = { $regex: search, $options: "i" };
    }

    if (type) {
      filter.assetType = type;
    }

    const assets = await AssignedAsset.find(filter).sort({
      assignmentDate: -1,
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
