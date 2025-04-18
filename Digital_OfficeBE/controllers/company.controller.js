import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { isOTPVerified } from "../utils/otp.helper.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import db from '../models/index.js'

const {User,Company,CompanyMembership}=db


const registerCompany = asyncHandler(async (req, res) => {
   
    const {
        companyName,
        companyEmail,
        domain,
        address,
        adminName,
        adminEmail,
        adminPassword,
      } = req.body;
    
      if (!companyName) throw new ApiError(400, "companyName is required");
      if (!companyEmail) throw new ApiError(400, "companyEmail is required");
      if (!domain) throw new ApiError(400, "domain is required");
      if (!address) throw new ApiError(400, "address is required");
    
      const verifiedCompanyEmail = await isOTPVerified(companyEmail);

      if (!verifiedCompanyEmail) {
        return res.status(403).json({ message: "Please verify company E-Mail before registering" });
      }
    
      if (!adminName) throw new ApiError(400, "adminName is required");
      if (!adminEmail) throw new ApiError(400, "adminEmail is required");
      if (!adminPassword) throw new ApiError(400, "adminPassword is required");
    
      const verifiedAdminEmail = await isOTPVerified(adminEmail);
      if (!verifiedAdminEmail) {
        return res.status(403).json({ message: "Please verify admin E-Mail before registering" });
      }
    
      const existingCompany = await Company.findOne({ where: { email: companyEmail } });
      if (existingCompany) {
        return res.status(400).json({ message: 'Company with this email already exists.' });
      }
    
      const existingAdmin = await User.findOne({ where: { email: adminEmail } });
      if (existingAdmin) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
    

    const company = await Company.create({
        name: companyName,
        email: companyEmail,
        domain,
        address,
    });
  

    const user = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        company_id: company.company_id,
        status: 'active',
    });
  

    await CompanyMembership.create({
        user_id: user.user_id,
        company_id: company.company_id,
        role: 'Admin',
    });


    return res.status(201).json(
        new ApiResponse(200, { company, user }, "Company and Admin registered Successfully!")
      );
})


export default registerCompany;
