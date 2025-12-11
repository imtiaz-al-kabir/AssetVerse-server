import Asset from "../models/Asset.js";
import AssignedAsset from "../models/AssignedAsset.js";
import EmployeeAffiliation from "../models/EmployeeAffiliation.js";
import Request from "../models/Request.js";
import User from "../models/User.js";


export const createRequest = async (req, res) => {
  try {
    const { assetId, requestType, note } = req.body;

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
      requesterEmail: req.user.email,
      requesterImage: req.user.profileImage || "",
      hrEmail: asset.hrEmail,
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

//    Get requests
export const getRequests = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // HR → See requests made to them
    if (req.user.role === "hr") {
      filter.hrEmail = req.user.email;
    }
    // Employee → See only their own requests
    else {
      filter.requesterEmail = req.user.email;
    }

    const total = await Request.countDocuments(filter);

    const requests = await Request.find(filter)
      .sort({ requestDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Logic for Approval
    if (status === "approved") {
      const asset = await Asset.findById(request.assetId);
      const hrUser = await User.findById(req.user._id);


      if (asset.availableQuantity <= 0) {
        return res
          .status(400)
          .json({ message: "Asset out of stock, cannot approve." });
      }


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


        const employeeUser = await User.findOne({
          email: request.requesterEmail,
        });

        if (employeeUser) {
          await EmployeeAffiliation.create({
            employeeId: employeeUser._id,
            hrId: req.user._id,
            employeeEmail: employeeUser.email,
            employeeName: employeeUser.name,
            employeeImage: employeeUser.profileImage || "",
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
