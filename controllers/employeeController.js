
import EmployeeAffiliation from "../models/EmployeeAffiliation.js";
import User from "../models/User.js";



export const getMyTeam = async (req, res) => {
  try {
    const team = await EmployeeAffiliation.find({ hrId: req.user._id });

   
    const teamWithImages = await Promise.all(
      team.map(async (member) => {
        if (!member.employeeImage) {
          const user = await User.findOne({ email: member.employeeEmail });
          if (user && user.profileImage) {
            member.employeeImage = user.profileImage;
          }
        }
        return member;
      })
    );

    res.json(teamWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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

export const getTeamForEmployee = async (req, res) => {
  try {


    let myAffiliations = await EmployeeAffiliation.find({
      employeeEmail: req.user.email,
    });


    const { hrId } = req.query;

    if (!hrId && myAffiliations.length > 0) {

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
