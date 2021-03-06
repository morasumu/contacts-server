import express, { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import { uuid } from "uuidv4";
import Contact from "../models/Contact.model";

import { __error } from "../utils";

const upload = multer({ dest: "assets/" });

const router = express.Router();

router.route("/ping").get((req: Request, res: Response) => {
  res.status(200).send("Hi from server");
});

/**
 * @route [POST] /contacts
 * @description creates a new contact.
 * @param {string} name
 * @param {string} lastName
 * @param {string} phoneNumber
 * @param {string} email
 * @param {number} age
 * @param {string} avatar
 * @param {file} avatarFile has the higher priority if exists, will replace 'avatar' field with the uploaded file.
 * @param {string} linkToWebsite
 * @param {string} tags comma-separated tags
 * @returns { status: boolean; message: string; data: Contact; } success response
 */
router.post("/", upload.single("avatarFile"), (req: Request, res: Response) => {
  return Promise.resolve()
    .then(() => {
      const contact = Contact.build({
        ...req.body,
        owner: "0x0A92DD7B30f0f57343AD99a151dBC37a3F3F95F3",
      });

      if (req.file) {
        const ext = req.file.originalname.split(".").pop();
        const filename = `${uuid()}.${ext}`;
        fs.renameSync(req.file.path, `assets/${filename}`);

        const domain = `${req.protocol}://${req.get("host")}`;
        contact.avatar = `${domain}/${filename}`;
      }

      return contact.save();
    })
    .then((contact) => {
      return res.json({
        status: true,
        message: "Contact created successfully!",
        data: contact,
      });
    })
    .catch((error) => __error(res, error));
});

/**
 * @route [GET] /contacts/:id
 * @description returns a contact for a given id.
 * @param {string} id The id of the contact
 * @returns {status: boolean; message: string; data: Contact } success response
 *
 */
router.get("/:id", (req: Request, res: Response) => {
  return Contact.findOne({
    where: { id: req.params.id },
  }).then((contact) =>
    res.json({ status: true, message: "success", data: contact })
  );
});

/**
 * @route [GET] /contacts
 * @description get the contact list by limit & page.
 * @param {string} limit the maximum number of contact to load in a request. in query.
 * @param {string} page the page index starting from 1. in query.
 * @returns { status: boolean; message: string; data: Contact[] } success response
 */
router.get("/", (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const offset = (page - 1) * limit;

  return Contact.findAll({
    limit,
    offset,
  })
    .then((contacts) =>
      res.json({ status: true, message: "success", data: contacts })
    )
    .catch((error) => __error(res, error));
});

/**
 * @route [PATCH] /contacts/:id
 * @description updates a contact by id.
 * @param {string} id The id of the contact.
 * @param {...Contact} _ same payload as in [POST] /contacts
 * @returns { status: boolean; message: string; data: Contact }
 */
router.patch(
  "/:id",
  upload.single("avatarFile"),
  (req: Request, res: Response) => {
    return Promise.resolve()
      .then(() => {
        const contact = {
          ...req.body,
          owner: "0x0A92DD7B30f0f57343AD99a151dBC37a3F3F95F3",
        };
        if (req.file) {
          const ext = req.file.originalname.split(".").pop();
          const filename = `${uuid()}.${ext}`;
          fs.renameSync(req.file.path, `assets/${filename}`);

          const domain = `${req.protocol}://${req.get("host")}`;
          contact.avatar = `${domain}/${filename}`;
        }
        return Contact.update(contact, { where: { id: req.params.id } });
      })
      .then(() => Contact.findOne({ where: { id: req.params.id } }))
      .then((contact) =>
        res.json({ status: true, message: "success", data: contact })
      )
      .catch((error) => __error(res, error));
  }
);

/**
 * @route [DELETE] /contacts/:id
 * @description delete a contact by id.
 * @param {string} id The id of the contact.
 * @returns { status: boolean, message: string, data: Contact }
 */
router.delete("/:id", (req: Request, res: Response) => {
  return Contact.findOne({ where: { id: req.params.id } })
    .then((contact) => {
      return Contact.destroy({ where: { id: req.params.id } }).then(() =>
        res.json({
          status: true,
          message: "success",
          data: contact,
        })
      );
    })
    .catch((error) => __error(res, error));
});

export default router;
