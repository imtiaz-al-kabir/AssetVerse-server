import Asset from '../models/Asset.js';
import User from '../models/User.js';


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
        

        // Search logic
        if (search) {
            filter.productName = { $regex: search, $options: 'i' };
        }

        // Type filter
        if (type) {
            filter.productType = type;
        }

 

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


export const createAsset = async (req, res) => {
    try {
        const { productName, productType, productQuantity, productImage } = req.body;

        const asset = new Asset({
            productName,
            productType,
            productQuantity, 
            availableQuantity: productQuantity, 
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


export const updateAsset = async (req, res) => {
    try {
        const { productName, productType, productQuantity, productImage } = req.body;
        const asset = await Asset.findById(req.params.id);

        if (asset && asset.hrEmail === req.user.email) {
            asset.productName = productName || asset.productName;
            asset.productType = productType || asset.productType;
            asset.productImage = productImage || asset.productImage;

          
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
