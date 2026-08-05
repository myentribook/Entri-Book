// const Bill = require('../models/billModel');
// const Purchase = require('../models/purchaseModel');
// const Product = require('../models/productModel');
// const mongoose = require('mongoose');
// const catchAsyncError = require('../middlewares/catchAsyncError'); // Ensure this path is correct
// const ErrorHandler = require('../utils/errorHandler'); // Ensure this path is correct

// exports.getDashboardReports = catchAsyncError(async (req, res, next) => {
//     const userId = new mongoose.Types.ObjectId(req.user.id);
//     const now = new Date();
//     const today = new Date(now.setHours(0, 0, 0, 0));
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

//     // 1. Optimized Sales Aggregation
//     const salesStats = await Bill.aggregate([
//         { $match: { user: userId } },
//         {
//             $facet: {
//                 today: [
//                     { $match: { createdAt: { $gte: today } } },
//                     { $group: { _id: null, totalPaid: { $sum: "$paidAmount" }, count: { $sum: 1 } } }
//                 ],
//                 month: [
//                     { $match: { createdAt: { $gte: startOfMonth } } },
//                     { $group: { _id: null, totalPaid: { $sum: "$paidAmount" }, totalDue: { $sum: { $subtract: ["$grandTotal", "$paidAmount"] } } } }
//                 ],
//                 prevMonth: [
//                     { $match: { createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } } },
//                     { $group: { _id: null, totalPaid: { $sum: "$paidAmount" } } }
//                 ]
//             }
//         }
//     ]);

//     // 2. Purchase Aggregation
//     const purchaseStats = await Purchase.aggregate([
//         { $match: { user: userId, createdAt: { $gte: startOfMonth } } },
//         { $group: { _id: null, total: { $sum: "$grandTotal" } } }
//     ]);

//     // 3. Product & Top Selling Queries
//     const [totalProducts, lowStockItems, topSelling] = await Promise.all([
//         Product.countDocuments({ user: userId }),
//         Product.find({ user: userId, stock: { $lt: 5 } }).select('name stock'),
//         Bill.aggregate([
//             { $match: { user: userId } },
//             { $unwind: "$items" },
//             { $group: { _id: "$items.product", totalQty: { $sum: "$items.quantity" } } },
//             { $sort: { totalQty: -1 } },
//             { $limit: 5 }
//         ])
//     ]);

//     // Extracting values safely
//     const stats = salesStats[0] || { today: [], month: [], prevMonth: [] };
//     const monthSales = stats.month[0]?.totalPaid || 0;
//     const prevMonthSales = stats.prevMonth[0]?.totalPaid || 0;

//     let growthPercentage = prevMonthSales > 0
//         ? ((monthSales - prevMonthSales) / prevMonthSales) * 100
//         : (monthSales > 0 ? 100 : 0);

//     res.status(200).json({
//         success: true,
//         message: "get reports successfully",
//         reports: {
//             todaySales: stats.today[0]?.totalPaid || 0,
//             monthSales,
//             previousMonthSales: prevMonthSales,
//             monthDueAmount: stats.month[0]?.totalDue || 0,
//             growthPercentage: parseFloat(growthPercentage.toFixed(2)),
//             todayBillCount: stats.today[0]?.count || 0,
//             totalPurchase: purchaseStats[0]?.total || 0,
//             totalProducts,
//             lowStockCount: lowStockItems.length,
//             lowStockItems,
//             topSelling
//         }
//     });
// });

// // const Bill = require('../models/billModel');
// // const Purchase = require('../models/purchaseModel');
// // const Product = require('../models/productModel');
// // const catchAsyncError = require('../middlewares/catchAsyncError');
// // const ErrorHandler = require('../utils/ErrorHandler')

// // exports.getDashboardReports = catchAsyncError(async (req, res, next) => {
// //     const now = new Date();
// //     const today = new Date(now.setHours(0, 0, 0, 0));
// //     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
// //     const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

// //     // 1. Optimized Sales Aggregation (Removed user filter)
// //     const salesStats = await Bill.aggregate([
// //         {
// //             $facet: {
// //                 today: [
// //                     { $match: { createdAt: { $gte: today } } },
// //                     { $group: { _id: null, totalPaid: { $sum: "$paidAmount" }, count: { $sum: 1 } } }
// //                 ],
// //                 month: [
// //                     { $match: { createdAt: { $gte: startOfMonth } } },
// //                     { $group: { _id: null, totalPaid: { $sum: "$paidAmount" }, totalDue: { $sum: { $subtract: ["$grandTotal", "$paidAmount"] } } } }
// //                 ],
// //                 prevMonth: [
// //                     { $match: { createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } } },
// //                     { $group: { _id: null, totalPaid: { $sum: "$paidAmount" } } }
// //                 ]
// //             }
// //         }
// //     ]);

// //     // 2. Purchase Aggregation (Removed user filter)
// //     const purchaseStats = await Purchase.aggregate([
// //         { $match: { createdAt: { $gte: startOfMonth } } },
// //         { $group: { _id: null, total: { $sum: "$grandTotal" } } }
// //     ]);

// //     // 3. Product & Top Selling Queries (Removed user filter)
// //     const [totalProducts, lowStockItems, topSelling] = await Promise.all([
// //         Product.countDocuments({}),
// //         Product.find({ stock: { $lt: 5 } }).select('name stock'),
// //         Bill.aggregate([
// //             { $unwind: "$items" },
// //             { $group: { _id: "$items.product", totalQty: { $sum: "$items.quantity" } } },
// //             { $sort: { totalQty: -1 } },
// //             { $limit: 5 }
// //         ])
// //     ]);

// //     const stats = salesStats[0] || { today: [], month: [], prevMonth: [] };
// //     const monthSales = stats.month[0]?.totalPaid || 0;
// //     const prevMonthSales = stats.prevMonth[0]?.totalPaid || 0;

// //     let growthPercentage = prevMonthSales > 0
// //         ? ((monthSales - prevMonthSales) / prevMonthSales) * 100
// //         : (monthSales > 0 ? 100 : 0);

// //     // await new Promise((resolve) => setTimeout(resolve, 3000));

// //     res.status(200).json({
// //         success: true,
// //         message: "get reports successfully",
// //         reports: {
// //             todaySales: stats.today[0]?.totalPaid || 0,
// //             monthSales,
// //             previousMonthSales: prevMonthSales,
// //             monthDueAmount: stats.month[0]?.totalDue || 0,
// //             growthPercentage: parseFloat(growthPercentage.toFixed(2)),
// //             todayBillCount: stats.today[0]?.count || 0,
// //             totalPurchase: purchaseStats[0]?.total || 0,
// //             totalProducts,
// //             lowStockCount: lowStockItems.length,
// //             lowStockItems,
// //             topSelling
// //         }
// //     });
// // });



const Bill = require('../models/billModel');
const Purchase = require('../models/purchaseModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');
const catchAsyncError = require('../middlewares/catchAsyncError'); 
const ErrorHandler = require('../utils/ErrorHandler'); 

exports.getDashboardReports = catchAsyncError(async (req, res, next) => {
    // Safety check to prevent 500 error if user is not authenticated
    if (!req.user || !req.user.id) {
        return next(new ErrorHandler("User not authenticated", 401));
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Optimized Sales Aggregation
    const salesStats = await Bill.aggregate([
        { $match: { user: userId } },
        {
            $facet: {
                today: [
                    { $match: { createdAt: { $gte: today } } },
                    { $group: { _id: null, totalPaid: { $sum: "$paidAmount" }, count: { $sum: 1 } } }
                ],
                month: [
                    { $match: { createdAt: { $gte: startOfMonth } } },
                    { $group: { _id: null, totalPaid: { $sum: "$paidAmount" }, totalDue: { $sum: { $subtract: ["$grandTotal", "$paidAmount"] } } } }
                ],
                prevMonth: [
                    { $match: { createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } } },
                    { $group: { _id: null, totalPaid: { $sum: "$paidAmount" } } }
                ]
            }
        }
    ]);

    // 2. Purchase Aggregation
    const purchaseStats = await Purchase.aggregate([
        { $match: { user: userId, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);

    // 3. Product & Top Selling Queries
    const [totalProducts, lowStockItems, topSelling] = await Promise.all([
        Product.countDocuments({ user: userId }),
        Product.find({ user: userId, stock: { $lt: 5 } }).select('name stock'),
        Bill.aggregate([
            { $match: { user: userId } },
            { $unwind: "$items" },
            { $group: { _id: "$items.product", totalQty: { $sum: "$items.quantity" } } },
            { $sort: { totalQty: -1 } },
            { $limit: 5 }
        ])
    ]);

    // Extracting values safely
    const stats = salesStats[0] || { today: [], month: [], prevMonth: [] };
    const monthSales = stats.month[0]?.totalPaid || 0;
    const prevMonthSales = stats.prevMonth[0]?.totalPaid || 0;

    let growthPercentage = prevMonthSales > 0
        ? ((monthSales - prevMonthSales) / prevMonthSales) * 100
        : (monthSales > 0 ? 100 : 0);

    res.status(200).json({
        success: true,
        message: "get reports successfully",
        reports: {
            todaySales: stats.today[0]?.totalPaid || 0,
            monthSales,
            previousMonthSales: prevMonthSales,
            monthDueAmount: stats.month[0]?.totalDue || 0,
            growthPercentage: parseFloat(growthPercentage.toFixed(2)),
            todayBillCount: stats.today[0]?.count || 0,
            totalPurchase: purchaseStats[0]?.total || 0,
            totalProducts,
            lowStockCount: lowStockItems.length,
            lowStockItems,
            topSelling
        }
    });
});
