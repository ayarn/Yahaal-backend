const Service = require("../models/service.model");
const Vendor = require("../models/vendor.model");

module.exports = async function (fastify, opts) {
  fastify.register(
    function (fastify, opts, done) {
      fastify.get("/all-vendors", async (req, reply) => {
        try {
          const allVendors = await Vendor.find({});

          if (!allVendors) {
            return reply.code(400).send({ message: "No vendors available" });
          }

          reply.send({ allVendors, message: "All Vendors received" });
        } catch (error) {
          console.log(error);
        }
      });

      fastify.post("/vendor-register", async (req, reply) => {
        const { vendor_name, vendor_email, vendor_contact, instagram_account } =
          req.body;

        if (!vendor_name || !vendor_email || !vendor_contact) {
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

      fastify.get("/all-services", async (req, reply) => {
        try {
          const allServices = await Service.find({});

          if (!allServices) {
            return reply.code(400).send({ message: "No service available" });
          }

          reply.send({ allServices, message: "All Services received" });
        } catch (error) {
          console.log(error);
        }
      });

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

      done();
    },
    { prefix: "/api/v1" }
  );
};
