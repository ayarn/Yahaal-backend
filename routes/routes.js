const Service = require("../models/service.model");
const Vendor = require("../models/vendor.model");
const requestPasswordReset = require("../service/auth.service");

module.exports = async function (fastify, opts) {
  fastify.register(
    function (fastify, opts, done) {
      // --------------- VENDOR --------------- //

      fastify.post("/vendor-register", async (req, reply) => {
        const {
          vendor_name,
          vendor_email,
          password,
          vendor_contact,
          instagram_account,
        } = req.body;

        if (!vendor_name || !vendor_email || !password || !vendor_contact) {
          return reply.code(400).send({ message: "Fields are required" });
        }

        try {
          const vendorExist = await Vendor.findOne({
            vendor_email: vendor_email,
          });

          if (vendorExist) {
            return reply.code(403).send({
              message: "Email already exists",
            });
          }

          const vendor = await new Vendor({
            vendor_name,
            vendor_email,
            password,
            vendor_contact,
            instagram_account,
          });

          await vendor.save();

          reply
            .code(201)
            .send({ message: "Vendor Account created successfully" });
        } catch (error) {
          console.log(error);
        }
      });

      fastify.get("/all-vendors", async (req, reply) => {
        try {
          const allVendors = await Vendor.find({});

          if (!allVendors) {
            return reply.code(400).send({ message: "No vendors available" });
          }

          reply.code(201).send({ allVendors, message: "All Vendors received" });
        } catch (error) {
          console.log(error);
        }
      });

      fastify.get("/vendor/:id", async (req, reply) => {
        try {
          const vendorID = req.params.id;

          if (!vendorID) {
            return reply.code(400).send({ message: `Unexpected param` });
          }

          const vendor = await Vendor.findById(vendorID);

          if (!vendor) {
            return reply
              .code(400)
              .send({ message: `Vendor not found with id: ${vendorID}` });
          }

          reply.code(201).send({ vendor, message: "Vendor found" });
        } catch (error) {
          console.log(error);
          reply.code(400).send({ err: error });
        }
      });

      fastify.delete("/vendor/:id", async (req, reply) => {
        try {
          const vendorID = req.params.id;

          if (!vendorID) {
            return reply.code(400).send({ message: `Unexpected param` });
          }

          const vendor = await Vendor.findByIdAndDelete(vendorID);

          if (!vendor) {
            return reply
              .code(400)
              .send({ message: `Vendor not found with id: ${vendorID}` });
          }

          reply
            .code(201)
            .send({ vendor, message: "Vendor Removed successfully" });
        } catch (error) {
          console.log(error);
          reply.code(400).send({ err: error });
        }
      });

      // --------------- ADMIN --------------- //

      fastify.post("/approve-vendor/:id", async (req, reply) => {
        try {
          const vendorID = req.params.id;

          if (!vendorID) {
            return reply.code(400).send({ message: `Unexpected param` });
          }

          const updateVendor = await Vendor.findByIdAndUpdate(
            { _id: vendorID },
            {
              is_approved: true,
            }
          );

          if (!updateVendor) {
            return reply.code(400).send({
              message: `Unable to approve Vendor with id: ${vendorID}`,
            });
          }

          reply.code(201).send({ message: "Vendor approved successfully" });
        } catch (error) {
          reply.code(400).send({ err: error });
        }
      });

      fastify.post("/request-password-reset", async (req, reply) => {
        const email = req.body.email;

        const requestPasswordResetService =
          await requestPasswordReset.requestPasswordReset(email);

        reply.send(requestPasswordResetService);
      });

      fastify.post("/reset-password", async (req, reply) => {
        const { vendorID, token, password } = req.body;

        const resetPasswordService = await requestPasswordReset.resetPassword(
          vendorID,
          token,
          password
        );

        reply.send({
          resetPasswordService,
          message: "Password has been reset",
        });
      });

      // --------------- SERVICE --------------- //

      fastify.post("/add-service", async (req, reply) => {
        const {
          service_name,
          service_description,
          service_type,
          service_status,
          category,
        } = req.body;

        if (
          !service_name ||
          !service_description ||
          !service_type ||
          !service_status ||
          !category
        ) {
          return reply.code(400).send({ message: "Fields are required" });
        }

        const generateServiceCode = () => {
          const min = 100000000000;
          const max = 999999999999;
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const service_code = generateServiceCode();

        try {
          const serviceExist = await Service.findOne({
            service_name: service_name,
          });

          if (serviceExist) {
            return reply.code(403).send({
              message: "Service is already exist",
            });
          }

          const service = await new Service({
            service_name,
            service_description,
            service_type,
            service_status,
            service_code,
            category,
          });

          await service.save();

          reply.code(201).send({ message: "Service added successfully" });
        } catch (error) {
          console.log(error);
        }
      });

      fastify.get("/all-services", async (req, reply) => {
        try {
          const allServices = await Service.find({});

          if (!allServices) {
            return reply.code(400).send({ message: "No service available" });
          }

          reply.send({ allServices, message: "All Services received" });
        } catch (error) {
          reply.code(400).send({ err: error });
        }
      });

      fastify.delete("/service/:id", async (req, reply) => {
        try {
          const serviceID = req.params.id;
          

          if (!serviceID) {
            return reply.code(400).send({ message: `Unexpected param` });
          }

          const service = await Service.findByIdAndDelete(serviceID);

          if (!service) {
            return reply
              .code(400)
              .send({ message: `Service not found with id: ${serviceID}` });
          }

          reply
            .code(201)
            .send({ service, message: "Service Removed successfully" });
        } catch (error) {
          console.log(error);
          reply.code(400).send({ err: error });
        }
      });

      done();
    },
    { prefix: "/api/v1" }
  );
};


[
  { date: "22/02/2024", availableSeats: 10 },
  { date: "25/02/2024", availableSeats: 34 },
  { date: "01/03/2024", availableSeats: 0 },
]