// import { asyncHandler } from "../utils/asyncHandler.js"
// import { ApiError } from "../utils/ApiError.js"
// import { ApiResponse } from "../utils/ApiResponse.js"
// import jwt from "jsonwebtoken"

// import db from '../models/index.js'
// const {User,Company,CompanyMembership}=db

// const generateAccessAndRefereshTokens = async (orgId) => {
//     try {
//         const org = await Org.findById(orgId)
//         const accessToken = org.generateAccessToken()
//         const refreshToken = org.generateRefreshToken()
//         console.log(refreshToken);
//         console.log(accessToken);
//         org.refreshToken = refreshToken
//         await org.save({ validateBeforeSave: false })          
//         org.refreshToken = refreshToken
//         return { accessToken, refreshToken }

//     } catch (error) {
//         console.log(error);
//         throw new ApiError(500, "Something went wrong while generating referesh and access token")
//     }
// }

//   const loginOrg = asyncHandler(async (req, res) => {
//     const {email,orgname,password} = req.body;
//     console.log(req.body);
//     if (!orgname && !email) {
//         throw new ApiError(400, "orgname or email is required")
//     }
//     const org = await Org.findOne({
//         $or: [{ orgname }, { email }]
//     })
//     if (!org) {
//         throw new ApiError(404, "Org does not exist")
//     }
//     const isPasswordValid = await org.isPasswordCorrect(password)
//     if (!isPasswordValid) {
//         throw new ApiError(401, "Invalid org credentials")
//     }
//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(org._id)
//     const loggedInOrg = await Org.findById(org._id).select("-password -refreshToken")
//     const options = {//cookies are modifieable only at the server by this option
//         httpOnly: true,
//         secure: true
//     }
//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     org: loggedInOrg, accessToken, refreshToken
//                 },
//                 "Org logged In Successfully"
//             )
//         )
// })



// const logoutOrg = asyncHandler(async (req, res) => {
//     console.log(req)
//     await Org.findByIdAndUpdate(
//         req.org._id,
//         {
//             $unset: {
//                 refreshToken: 1 // this removes the field from document
//             }
//         },
//         {
//             new: true
//         }
//     )
//     const options = {
//         httpOnly: true,
//         secure: true
//     }

//     return res
//         .status(200)
//         .clearCookie("accessToken", options)
//         .clearCookie("refreshToken", options)
//         .json(new ApiResponse(200, {}, "Org logged Out"))
// })
// const deleteAccount = async (req, res) => {
//     try {
//         const orgId=req.org.id;
//       const org = await Org.findByIdAndDelete(orgId); 


//     //   if (!org) return res.status(404).json({ error: 'Org not found' }); 
      
//       res.status(200).json({ message: 'Org account deleted successfully' });
//     }
//      catch (err)
//       {
//       res.status(500).json({ error: 'Failed to delete Org account' });
//       }
//   };
  
  
// const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

//     if (!incomingRefreshToken) {
//         throw new ApiError(401, "unauthorized request")
//     }

//     try {
//         const decodedToken = jwt.verify(
//             incomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         )

//         // console.log(decodedToken)
//         const org = await Org.findById(decodedToken?._id)
//         if (!org) {
//             throw new ApiError(401, "Invalid refresh token")
//         }
//         //console.log(org?.refreshToken);
//         if (incomingRefreshToken !== org?.refreshToken) {
//             throw new ApiError(401, "Refresh token is expired or used")
//         }
//         const options = {
//             httpOnly: true,
//             secure: true
//         }
//         const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(org._id)
//         return res
//             .status(200)
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", refreshToken, options)
//             .json(
//                 new ApiResponse(
//                     200,
//                     { accessToken, refreshToken },
//                     "Access token refreshed"
//                 )
//             )
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid refresh token")
//     }

// })

// export {registerCompany , loginOrg, logoutOrg,deleteAccount , refreshAccessToken};