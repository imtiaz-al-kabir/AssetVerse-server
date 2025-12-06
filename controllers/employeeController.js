
import EmployeeAffiliation from "../models/EmployeeAffiliation.js";
import User from "../models/User.js";


// @desc    Get HR's employees (Team)
// @route   GET /api/employees/my-team
// @access  Private (HR)
export const getMyTeam = async (req, res) => {
  try {
    const team = await EmployeeAffiliation.find({ hrId: req.user._id });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove employee from team
// @route   DELETE /api/employees/:id (id is Affiliation ID)
// @access  Private (HR)
export const removeEmployee = async (req, res) => {
  try {
    const affiliation = await EmployeeAffiliation.findById(req.params.id);

    if (!affiliation) {
      return res.status(404).json({ message: "Affiliation not found" });
    }

    if (affiliation.hrId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await affiliation.deleteOne();

    // Decrement HR count
    const hrUser = await User.findById(req.user._id);
    if (hrUser.currentEmployees > 0) {
      hrUser.currentEmployees -= 1;
      await hrUser.save();
    }

    res.json({ message: "Employee removed from team" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Employee's Team (Colleagues)
// @route   GET /api/employees/team-list
// @access  Private (Employee)
export const getTeamForEmployee = async (req, res) => {
  try {
    // First get the HR for the logged-in employee (via Affiliation)
    // Since an employee can be in multiple companies, we might need a companyId query param?
    // Or we just return all colleagues from all companies grouped?
    // Let's assume the user sends ?hrId=... or we just fetch all affiliations if not provided

    // For simplicity: Return all affiliations where the HR is the same as the user's affiliations
    // This is complex. Let's simplify: Get all affiliations where the user is a MEMBER.
    // Then for each affiliation (company), get all OTHER members.

    let myAffiliations = await EmployeeAffiliation.find({
      employeeEmail: req.user.email,
    });

    // If query param ?companyName provided, filter
    // Ideally we pass companyName/hrId from frontend

    // For MyTeam page, maybe just list all colleagues from ONE company selected in dropdown
    // So we expect ?hrId in query

    const { hrId } = req.query;

    if (!hrId && myAffiliations.length > 0) {
      // Default to first company
      // const firstHrId = myAffiliations[0].hrId;
      // return team for that
      // Actually, let's just return list of Companies the user is in, so they can select
      // This endpoint might be dual usage:
      // 1. Get my companies
      // 2. Get team for a company
      // Let's split? No.

      // If no hrId, return list of my companies
      return res.json({ type: "companies", data: myAffiliations });
    } else if (hrId) {
      // Verify I am in this company
      const amInCompany = myAffiliations.find(
        (a) => a.hrId.toString() === hrId
      );
      if (!amInCompany) {
        return res
          .status(401)
          .json({ message: "Not affiliated with this company" });
      }

      const team = await EmployeeAffiliation.find({ hrId });
      return res.json({ type: "team", data: team });
    } else {
      return res.json({ type: "companies", data: [] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
