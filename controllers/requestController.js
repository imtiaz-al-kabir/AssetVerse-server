import Asset from "../models/Asset.js";
import AssignedAsset from "../models/AssignedAsset.js";
import EmployeeAffiliation from "../models/EmployeeAffiliation.js";
import Request from "../models/Request.js";
import User from "../models/User.js";

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
  try {
    const { assetId, requestType, note } = req.body; // requestType usually 'Request' here

    const asset = await Asset.findById(assetId);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (asset.availableQuantity <= 0) {
      return res.status(400).json({ message: "Asset is out of stock" });
    }

    const request = new Request({
      assetId,
      assetName: asset.productName,
      assetType: asset.productType,
      requesterName: req.user.name,
      requesterEmail: req.user.email, // User is Employee
      hrEmail: asset.hrEmail, // The HR owning the asset
      companyName: asset.companyName,
      requestStatus: "pending",
      requestType: requestType || "Request",
      note,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests
export const getRequests = async (req, res) => {
  try {
    let requests;
    if (req.user.role === "hr") {
      requests = await Request.find({ hrEmail: req.user.email }).sort({
        requestDate: -1,
      });
    } else {
      requests = await Request.find({ requesterEmail: req.user.email }).sort({
        requestDate: -1,
      });
    }
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status (Approve/Reject)
// @route   PUT /api/requests/:id
// @access  Private (HR only)
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Logic for Approval
    if (status === "approved") {
      const asset = await Asset.findById(request.assetId);
      const hrUser = await User.findById(req.user._id);

      // 1. Check stock
      if (asset.availableQuantity <= 0) {
        return res
          .status(400)
          .json({ message: "Asset out of stock, cannot approve." });
      }

      // 2. Check Package Limit
      // Count unique employees affiliated
      // If this employee is NEW (not yet affiliated), check limit
      const isAffiliated = await EmployeeAffiliation.findOne({
        hrId: req.user._id,
        employeeEmail: request.requesterEmail,
      });

      if (!isAffiliated) {
        if (hrUser.currentEmployees >= hrUser.packageLimit) {
          return res
            .status(400)
            .json({ message: "Package limit reached. Upgrade required." });
        }

        // Create Affiliation
        // We need the employee's ID. We can find it via email from User collection
        const employeeUser = await User.findOne({
          email: request.requesterEmail,
        });

        if (employeeUser) {
          await EmployeeAffiliation.create({
            employeeId: employeeUser._id,
            hrId: req.user._id,
            employeeEmail: employeeUser.email,
            employeeName: employeeUser.name,
            hrEmail: req.user.email,
            companyName: req.user.companyName,
            companyLogo: req.user.companyLogo,
          });

          // Increment current employees count
          hrUser.currentEmployees += 1;
          await hrUser.save();
        }
      }

      // 3. Decrement Stock
      asset.availableQuantity -= 1;
      await asset.save();

      // 4. Create Assigned Asset Record
      await AssignedAsset.create({
        assetId: asset._id,
        assetName: asset.productName,
        assetImage: asset.productImage,
        assetType: asset.productType,
        employeeEmail: request.requesterEmail,
        employeeName: request.requesterName,
        hrEmail: req.user.email,
        companyName: req.user.companyName,
      });

      request.approvalDate = Date.now();
      request.processedBy = req.user.email;
    }

    request.requestStatus = status;
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
