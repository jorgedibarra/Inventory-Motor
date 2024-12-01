package com.project.backend.web.controller;

import com.project.backend.domain.Sale;
import com.project.backend.domain.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sale")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @GetMapping("/all")
    public ResponseEntity<List<Sale>> getAll() {
        return new ResponseEntity<>(saleService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{saleId}")
    public ResponseEntity<Sale> getSale(@PathVariable("saleId") Integer saleId) {
        return saleService.getSale(saleId)
                .map(sale -> new ResponseEntity<>(sale, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Sale>> getByClient(@PathVariable("clientId") Integer clientId) {
        return saleService.getByClient(clientId)
                .map(sales -> new ResponseEntity<>(sales, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/save")
    public ResponseEntity<Sale> save(@RequestBody Sale sale) {
        return new ResponseEntity<>(saleService.save(sale), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Sale> update(@RequestBody Sale sale) {
        return new ResponseEntity<>(saleService.save(sale), HttpStatus.CREATED);
    }
}
