import Asset from '../models/Asset.js';
import User from '../models/User.js';

// @desc    Get assets (HR sees own, Employee sees all or filtered)
// @route   GET /api/assets
// @access  Private (Advanced filter for HR/Employee)
export const getAssets = async (req, res) => {
    try {
        const { search, type, limit = 10, page = 1 } = req.query;
        const skip = (page - 1) * limit;

        // Base filter
        let filter = {};

        // If I am HR, only show my created assets
        if (req.user.role === 'hr') {
            filter.hrEmail = req.user.email;
        }
        // If I am Employee, I can search/see all available assets (for request feed)
        // OR filtering logic can be added here if employees should only see affiliated companies
        // For 'Request Asset' feed (all companies), no restriction on hrEmail.

        // Search logic
        if (search) {
            filter.productName = { $regex: search, $options: 'i' };
        }

        // Type filter
        if (type) {
            filter.productType = type;
        }

        // Available only filter (optional, maybe for employee view)
        // if (req.user.role === 'employee') {
        //    filter.availableQuantity = { $gt: 0 };
        // }

        const assets = await Asset.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Asset.countDocuments(filter);

        res.json({
            assets,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Create new asset
// @route   POST /api/assets
// @access  Private (HR only)
export const createAsset = async (req, res) => {
    try {
        const { productName, productType, productQuantity, productImage } = req.body;

        const asset = new Asset({
            productName,
            productType,
            productQuantity, // Total
            availableQuantity: productQuantity, // Initially same as total
            productImage,
            hrEmail: req.user.email,
            companyName: req.user.companyName,
        });

        const createdAsset = await asset.save();
        res.status(201).json(createdAsset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private (HR only)
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (asset && asset.hrEmail === req.user.email) {
            await asset.deleteOne();
            res.json({ message: 'Asset removed' });
        } else {
            res.status(404).json({ message: 'Asset not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private (HR only)
export const updateAsset = async (req, res) => {
    try {
        const { productName, productType, productQuantity, productImage } = req.body;
        const asset = await Asset.findById(req.params.id);

        if (asset && asset.hrEmail === req.user.email) {
            asset.productName = productName || asset.productName;
            asset.productType = productType || asset.productType;
            asset.productImage = productImage || asset.productImage;

            // Logic for quantity update if needed?
            // Simple override for now. Ideally should calc difference for availableQuantity
            if (productQuantity !== undefined) {
                const diff = productQuantity - asset.productQuantity;
                asset.productQuantity = productQuantity;
                asset.availableQuantity += diff;
            }

            const updatedAsset = await asset.save();
            res.json(updatedAsset);
        } else {
            res.status(404).json({ message: 'Asset not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
