


// import React, { Fragment, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createPayment, trails, verifyPayment, getMySubscription } from '../../actions/paymentAction';
// import { resetPayment } from '../../slices/paymentSlice';
// import '../styles/subscription.css';
// import toast, { Toaster } from 'react-hot-toast';

// export default function Subscription() {
//     const dispatch = useDispatch();
//     const { loading, payment, subscription, error, message } = useSelector((state) => state.paymentState);
    
//     // Logged-in user details
//     const { user } = useSelector((state) => state.authState || state.userState || {});

//     // Check if user has an active, valid subscription
//     const isAlreadySubscribed = React.useMemo(() => {
//         if (!subscription) return false;
        
//         const subData = subscription.user ? subscription : (Array.isArray(subscription) ? subscription.find(sub => sub.user === user?._id || sub.user?._id === user?._id) : null);

//         if (!subData) return false;

//         const userIdString = user?._id?.toString();
//         const subUserIdString = (typeof subData.user === 'object' ? subData.user?._id : subData.user)?.toString();

//         const isUserMatch = userIdString && subUserIdString && userIdString === subUserIdString;
//         const isActiveStatus = subData.status === 'active' || subData.status === 'trial' || subData.status === 'lifetime';
//         const isNotExpired = subData.endDate ? new Date(subData.endDate) > new Date() : true;

//         return isUserMatch && isActiveStatus && isNotExpired;
//     }, [subscription, user]);

//     const [shouldPay, setShouldPay] = useState(false);

//     useEffect(() => {
//         dispatch(resetPayment());
//         dispatch(getMySubscription());
//         setShouldPay(false);
//     }, [dispatch]);

//     const switchPlan = (planType) => {
//         const deck = document.getElementById('pricingDeckContainer');
//         const pills = document.querySelectorAll('.switcher-pill');
//         if (!deck) return;
//         deck.classList.remove('display-trial', 'display-monthly', 'display-annual');
//         deck.classList.add('display-' + planType);

//         pills.forEach(pill => {
//             pill.classList.remove('active-pill');
//             if (pill.textContent.toLowerCase().includes(planType)) {
//                 pill.classList.add('active-pill');
//             }
//         });
//     };

//     const handleTrial = () => {
//         if (isAlreadySubscribed) return;
//         dispatch(trails());
//     };

//     const handleSubscribe = (planName) => {
//         if (isAlreadySubscribed) return;
//         setShouldPay(true);
//         dispatch(createPayment({ plan: planName }));
//     };

//     useEffect(() => {
//         const orderData = payment?.order || payment;

//         if (shouldPay && orderData && orderData.id) {
//             const options = {
//                 key: "rzp_test_TKgkEW4fJWouhL",
//                 amount: orderData.amount,
//                 currency: orderData.currency,
//                 name: "Entribook",
//                 description: "Subscription Payment",
//                 order_id: orderData.id,
//                 handler: async function (response) {
//                     const verifyData = {
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature,
//                         plan: orderData.notes?.plan || "monthly"
//                     };
                    
//                     // 1. Verify payment
//                     await dispatch(verifyPayment(verifyData));
//                     setShouldPay(false);
                    
//                     // 2. Refresh subscription status after a short delay for DB sync
//                     setTimeout(() => {
//                         dispatch(getMySubscription());
//                     }, 1000);
//                 },
//                 prefill: {
//                     name: user?.name || "User",
//                     email: user?.email || "user@example.com",
//                 },
//                 theme: {
//                     color: "#0055d4"
//                 },
//                 modal: {
//                     ondismiss: function () {
//                         setShouldPay(false);
//                         dispatch(resetPayment());
//                     }
//                 }
//             };
//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         }
//     }, [payment, shouldPay, dispatch, user]);

//     useEffect(() => {
//         if (message) {
//             toast.success(message);
//         }
//         if (error) {
//             toast.error(error);
//         }
//     }, [message, error]);

//     return (
//         <Fragment>
//             <Toaster />
//             <div className="pricing-root">
//                 <div className="intro-block">
//                     <h1>Flexible Billing & Subscription Plans</h1>
//                     <p>Unlimited Bills , 
//                         Unlimited Products , 
//                         Unlimited Customers ,
//                         Unlimited Purchases ,
//                         Unlimited Reports ,
//                         Automatic Stock Management , 
//                         WhatsApp Invoice Sharing , 
//                         Free Feature Updates , 
//                         Secure Cloud Backup , 
//                         Priority Support</p>
//                 </div>

//                 <div className="switcher-wrapper">
//                     <button className="switcher-pill" onClick={() => switchPlan('trial')}>Trial</button>
//                     <button className="switcher-pill active-pill" onClick={() => switchPlan('monthly')}>Monthly</button>
//                     <button className="switcher-pill" onClick={() => switchPlan('annual')}>Annually</button>
//                 </div>

//                 <div className="pricing-deck display-monthly" id="pricingDeckContainer">
//                     <div className="tier-box trial-tier">
//                         <div className="tier-top">
//                             <h3 className="tier-title">Trial</h3>
//                         </div>
//                         <div className="cost-section">
//                             <div className="cost-display"><i className="fa-solid fa-indian-rupee-sign"></i> 0<span>/ 14 days</span></div>
//                         </div>
//                         <p className="tier-summary">Experience every feature before you subscribe. No hidden charges.</p>
//                         <button 
//                             className="action-cta" 
//                             onClick={handleTrial} 
//                             disabled={loading || isAlreadySubscribed}
//                             style={isAlreadySubscribed ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
//                         >
//                             {isAlreadySubscribed ? " Subscribed" : (loading ? "Processing..." : "Start free trial →")}
//                         </button>
//                     </div>

//                     <div className="tier-box tier-featured monthly-tier">
//                         <div className="tier-top">
//                             <h3 className="tier-title">Monthly</h3>
//                         </div>
//                         <div className="cost-section">
//                             <div className="cost-display"><i className="fa-solid fa-indian-rupee-sign"></i> 249<span>/ month</span></div>
//                         </div>
//                         <p className="tier-summary">Everything your business needs for just ₹ 249</p>
                        
//                         <button 
//                             className="action-cta" 
//                             onClick={() => handleSubscribe('monthly')} 
//                             disabled={loading || isAlreadySubscribed}
//                             style={isAlreadySubscribed ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
//                         >
//                             {isAlreadySubscribed ? "Subscribed" : (loading ? "Processing..." : "Get started →")}
//                         </button>
//                     </div>

//                     <div className="tier-box annual-tier">
//                         <div className="tier-top">
//                             <h3 className="tier-title">Quarterly Plan</h3>
//                         </div>
//                         <div className="cost-section">
//                             <div className="cost-display"><i className="fa-solid fa-indian-rupee-sign"></i> 660<span>/ 3 month </span></div>
//                         </div>
//                         <p className="tier-summary">Save more compared to monthly payments and enjoy uninterrupted business management for 3 months ( rs 747 - 10 %  Discount ).</p>
                        
//                         <button 
//                             className="action-cta" 
//                             onClick={() => handleSubscribe('quarterly')} 
//                             disabled={loading || isAlreadySubscribed}
//                             style={isAlreadySubscribed ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
//                         >
//                             {isAlreadySubscribed ? "Subscribed" : (loading ? "Processing..." : "Get started →")}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </Fragment>
//     );
// }

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPayment, trails, verifyPayment, getMySubscription } from '../../actions/paymentAction';
import { resetPayment } from '../../slices/paymentSlice';
import '../styles/subscription.css';
import toast, { Toaster } from 'react-hot-toast';

export default function Subscription() {
    const dispatch = useDispatch();
    const { loading, payment, subscription, error, message } = useSelector((state) => state.paymentState);
    
    // Logged-in user details
    const { user } = useSelector((state) => state.authState || state.userState || {});

    // Debug user and subscription states on render
    console.log("--- DEBUG: Render State ---", { user, subscription, payment, loading, error, message });

    // Check if user has an active, valid subscription
    const isAlreadySubscribed = React.useMemo(() => {
        console.log("--- DEBUG: Running isAlreadySubscribed memo ---", { subscription, user });
        if (!subscription) return false;
        
        const subData = subscription.user ? subscription : (Array.isArray(subscription) ? subscription.find(sub => sub.user === user?._id || sub.user?._id === user?._id) : null);

        console.log("--- DEBUG: Resolved subData ---", subData);
        if (!subData) return false;

        const userIdString = user?._id?.toString();
        const subUserIdString = (typeof subData.user === 'object' ? subData.user?._id : subData.user)?.toString();

        const isUserMatch = userIdString && subUserIdString && userIdString === subUserIdString;
        const isActiveStatus = subData.status === 'active' || subData.status === 'trial' || subData.status === 'lifetime';
        const isNotExpired = subData.endDate ? new Date(subData.endDate) > new Date() : true;

        console.log("--- DEBUG: Subscription Check Flags ---", {
            userIdString,
            subUserIdString,
            isUserMatch,
            isActiveStatus,
            subStatus: subData.status,
            isNotExpired,
            endDate: subData.endDate
        });

        return isUserMatch && isActiveStatus && isNotExpired;
    }, [subscription, user]);

    const [shouldPay, setShouldPay] = useState(false);

    useEffect(() => {
        console.log("--- DEBUG: Initial mount effect triggered ---");
        dispatch(resetPayment());
        dispatch(getMySubscription());
        setShouldPay(false);
    }, [dispatch]);

    const switchPlan = (planType) => {
        console.log("--- DEBUG: switchPlan called with ---", planType);
        const deck = document.getElementById('pricingDeckContainer');
        const pills = document.querySelectorAll('.switcher-pill');
        if (!deck) return;
        deck.classList.remove('display-trial', 'display-monthly', 'display-annual');
        deck.classList.add('display-' + planType);

        pills.forEach(pill => {
            pill.classList.remove('active-pill');
            if (pill.textContent.toLowerCase().includes(planType)) {
                pill.classList.add('active-pill');
            }
        });
    };

    const handleTrial = () => {
        console.log("--- DEBUG: handleTrial clicked ---", { isAlreadySubscribed });
        if (isAlreadySubscribed) return;
        dispatch(trails());
    };

    const handleSubscribe = (planName) => {
        console.log("--- DEBUG: handleSubscribe clicked with plan ---", planName, { isAlreadySubscribed });
        if (isAlreadySubscribed) return;
        setShouldPay(true);
        dispatch(createPayment({ plan: planName }));
    };

    useEffect(() => {
        const orderData = payment?.order || payment;
        console.log("--- DEBUG: Payment effect triggered ---", { shouldPay, orderData, payment });

        if (shouldPay && orderData && orderData.id) {
            console.log("--- DEBUG: Opening Razorpay modal with order ---", orderData);
            const options = {
                key: "rzp_test_TKgkEW4fJWouhL",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Entribook",
                description: "Subscription Payment",
                order_id: orderData.id,
                handler: async function (response) {
                    console.log("--- DEBUG: Razorpay success handler response ---", response);
                    const verifyData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        plan: orderData.notes?.plan || "monthly"
                    };
                    
                    console.log("--- DEBUG: Dispatching verifyPayment with ---", verifyData);
                    // 1. Verify payment
                    await dispatch(verifyPayment(verifyData));
                    setShouldPay(false);
                    
                    // 2. Refresh subscription status after a short delay for DB sync
                    setTimeout(() => {
                        console.log("--- DEBUG: Refreshing subscription status after payment verification ---");
                        dispatch(getMySubscription());
                    }, 1000);
                },
                prefill: {
                    name: user?.name || "User",
                    email: user?.email || "user@example.com",
                },
                theme: {
                    color: "#0055d4"
                },
                modal: {
                    ondismiss: function () {
                        console.log("--- DEBUG: Razorpay modal dismissed by user ---");
                        setShouldPay(false);
                        dispatch(resetPayment());
                    }
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        }
    }, [payment, shouldPay, dispatch, user]);

    useEffect(() => {
        console.log("--- DEBUG: Message/Error toast effect ---", { message, error });
        if (message) {
            toast.success(message);
        }
        if (error) {
            toast.error(error);
        }
    }, [message, error]);

    return (
        <Fragment>
            <Toaster />
            <div className="pricing-root">
                <div className="intro-block">
                    <h1>Flexible Billing & Subscription Plans</h1>
                    <p>Unlimited Bills , 
                        Unlimited Products , 
                        Unlimited Customers ,
                        Unlimited Purchases ,
                        Unlimited Reports ,
                        Automatic Stock Management , 
                        WhatsApp Invoice Sharing , 
                        Free Feature Updates , 
                        Secure Cloud Backup , 
                        Priority Support</p>
                </div>

                <div className="switcher-wrapper">
                    <button className="switcher-pill" onClick={() => switchPlan('trial')}>Trial</button>
                    <button className="switcher-pill active-pill" onClick={() => switchPlan('monthly')}>Monthly</button>
                    <button className="switcher-pill" onClick={() => switchPlan('annual')}>Annually</button>
                </div>

                <div className="pricing-deck display-monthly" id="pricingDeckContainer">
                    <div className="tier-box trial-tier">
                        <div className="tier-top">
                            <h3 className="tier-title">Trial</h3>
                        </div>
                        <div className="cost-section">
                            <div className="cost-display"><i className="fa-solid fa-indian-rupee-sign"></i> 0<span>/ 14 days</span></div>
                        </div>
                        <p className="tier-summary">Experience every feature before you subscribe. No hidden charges.</p>
                        <button 
                            className="action-cta" 
                            onClick={handleTrial} 
                            disabled={loading || isAlreadySubscribed}
                            style={isAlreadySubscribed ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                        >
                            {isAlreadySubscribed ? " Subscribed" : (loading ? "Processing..." : "Start free trial →")}
                        </button>
                    </div>

                    <div className="tier-box tier-featured monthly-tier">
                        <div className="tier-top">
                            <h3 className="tier-title">Monthly</h3>
                        </div>
                        <div className="cost-section">
                            <div className="cost-display"><i className="fa-solid fa-indian-rupee-sign"></i> 249<span>/ month</span></div>
                        </div>
                        <p className="tier-summary">Everything your business needs for just ₹ 249</p>
                        
                        <button 
                            className="action-cta" 
                            onClick={() => handleSubscribe('monthly')} 
                            disabled={loading || isAlreadySubscribed}
                            style={isAlreadySubscribed ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                        >
                            {isAlreadySubscribed ? "Subscribed" : (loading ? "Processing..." : "Get started →")}
                        </button>
                    </div>

                    <div className="tier-box annual-tier">
                        <div className="tier-top">
                            <h3 className="tier-title">Quarterly Plan</h3>
                        </div>
                        <div className="cost-section">
                            <div className="cost-display"><i className="fa-solid fa-indian-rupee-sign"></i> 660<span>/ 3 month </span></div>
                        </div>
                        <p className="tier-summary">Save more compared to monthly payments and enjoy uninterrupted business management for 3 months ( rs 747 - 10 %  Discount ).</p>
                        
                        <button 
                            className="action-cta" 
                            onClick={() => handleSubscribe('quarterly')} 
                            disabled={loading || isAlreadySubscribed}
                            style={isAlreadySubscribed ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                        >
                            {isAlreadySubscribed ? "Subscribed" : (loading ? "Processing..." : "Get started →")}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
