import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workersRouter from "./workers";
import workerListRouter from "./workerList";
import tokensRouter from "./tokens";
import dashboardRouter from "./dashboard";
import zeusRouter from "./zeus";
import toolConfigRouter from "./toolConfig";
import payoutRouter from "./payout";

const router: IRouter = Router();

router.use(healthRouter);
router.use(workersRouter);
router.use(workerListRouter);
router.use(tokensRouter);
router.use(dashboardRouter);
router.use(zeusRouter);
router.use(toolConfigRouter);
router.use(payoutRouter);

export default router;
